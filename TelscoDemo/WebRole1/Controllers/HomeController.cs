using Microsoft.Azure;
using Microsoft.Azure.Insights;
using Microsoft.Azure.Insights.Models;
using Microsoft.Azure.Management.ResourceManager;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using WebRole1.Models;

using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;

namespace WebRole1.Controllers
{


    public class HomeController : Controller
    {
        static DocumentClient client = null;
        static string databaseName;
        static string collectionName;
        static string documentId;
        public static DateTime currentTime = DateTime.Now; //declaring this to store the last pulled timestamp for telemetry volume graph
        static string region;

        public HomeController()
        {
            region = ConfigurationManager.AppSettings["Region"];
            databaseName = ConfigurationManager.AppSettings["DatabaseName"];
            collectionName = ConfigurationManager.AppSettings["CollectionName"];
            documentId = ConfigurationManager.AppSettings["DocumentId"];
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        [HttpPost]
        public async Task<JsonResult> GetGraphData()
        {
            GraphModel data = new GraphModel();
            Random random = new Random();
            int value_activeincidentsovertime = random.Next(20, 40);
            int value_maxtimetomitigateincidents = random.Next(10, 80);

            // int value_telemetryvolume = random.Next(50, 500); //need to get value from db

            // TaskAwaiter<double> awaiter =  GetTelemetryVolume().GetAwaiter();
            double[] value_telemetryvolume = await GetTelemetryVolume();

            double value_latencies =  GetLatencyValue();

            //int value_latencies = random.Next(20, 40);
            double value_activeusers = random.NextDouble(45.12, 51.21);

            double value_traficrequest = value_telemetryvolume[value_telemetryvolume.Length - 1];

            data.telemetryvolume = value_telemetryvolume;
            data.latencies = value_latencies;
            //data.latencies = value_activeincidentsovertime;
            data.maxtimetomitigateincidents = value_maxtimetomitigateincidents;
            data.percentageoftimethesystemviolated = 5;
            data.activeincidentsovertime = value_activeincidentsovertime;
            data.activeusers = value_activeusers;
            data.traficrequest = value_traficrequest;
            List<GraphModel> listdata = new List<GraphModel>();
            listdata.Add(data);

            return Json(new { items = listdata, success = true }, JsonRequestBehavior.AllowGet);
        }

        public double GetLatencyValue()
        {
            
            ConnectionPolicy policy = new ConnectionPolicy
            {
                ConnectionMode = ConnectionMode.Direct,
                ConnectionProtocol = Protocol.Tcp
            };
            policy.PreferredLocations.Add(region);
            HomeController.client = new DocumentClient(
                new Uri(ConfigurationManager.AppSettings["EndPointUrl"]),
                ConfigurationManager.AppSettings["AuthorizationKey"],
                policy);

            //warm up            
            
            for (int i = 0; i < 10; i++)
            {
                client.ReadDocumentAsync(UriFactory.CreateDocumentUri(
                   databaseName,
                   collectionName,
                   documentId)).Wait();
            }

            int startTicks = Environment.TickCount;
            for (int i = 0; i < 20; i++)
            {
                 client.ReadDocumentAsync(UriFactory.CreateDocumentUri(
                   databaseName,
                   collectionName,
                   documentId)).Wait();
            }
            double ticks = (Environment.TickCount - startTicks) / 20;
            
            return ticks;
            /*
            double[] latencies = new double[15];
            Random random = new Random();
            for (int i=0; i<15; i++)
            {
                latencies[i]= random.NextDouble(2.4, 8.7);
            }
            return latencies;*/
        }

        public async Task<double[]> GetTelemetryVolume()

        {
            string token = await GetAuthenticationHeader();

            string subscriptionID = "30ca6edd-dc52-46ee-9acb-39c5c7f54463";

            TokenCloudCredentials credentials = new TokenCloudCredentials(subscriptionID, token);
            string resourceUri = "/subscriptions/30ca6edd-dc52-46ee-9acb-39c5c7f54463/resourceGroups/GlobalDB/providers/Microsoft.DocumentDB/databaseAccounts/contosomini";

            //string subscriptionID = "36dfc234-9a2d-4f33-be43-db6e321dbc2bss";

            //TokenCloudCredentials credentials = new TokenCloudCredentials(subscriptionID, token);
            //string resourceUri = "/subscriptions/dd0db424-9a49-408d-911e-67e398aaaa3a/resourceGroups/artrejo-scaledemo2/providers/Microsoft.DocumentDB/databaseAccounts/artrejo-scaledemo2";

            //string filter = null;
            TimeSpan period = new TimeSpan(0, 0, 0, 30, 0);
            string filter = "(name.value eq 'Total Requests')";
            MetricListResponse vmMetricList = GetResourceMetrics(credentials, resourceUri, filter, TimeSpan.FromHours(1), "PT5M");

            //start - step automatic values from db
            var test = vmMetricList.MetricCollection.Value.FirstOrDefault().MetricValues;
            double[] metricValuesQuery = new double[test.Count];
           
            for (int i = 0; i < test.Count; i++)
            {
                if ((test[i].Total.HasValue == false) || (test[i].Total < 1000000)) 
                {
                    metricValuesQuery[i] = 1140350;
                }
                else
                {
                    metricValuesQuery[i] = test[i].Total.Value;
                }

            }
            return metricValuesQuery;
            //end

            ////start - steap static value
            //    double?[] metricValuesQuery = new double?[4];
            //    metricValuesQuery[0] = 21;
            //    metricValuesQuery[1] = 34;
            //    metricValuesQuery[2] = 4;
            //    metricValuesQuery[3] = 4;
            //    return metricValuesQuery;
            ////end

            //start - step single value from db
            //double metricValuesQuery = 0;
            //DateTime latestTime = vmMetricList.MetricCollection.Value.FirstOrDefault().MetricValues.Last().Timestamp;
            //metricValuesQuery = vmMetricList.MetricCollection.Value.FirstOrDefault().MetricValues.Last().Total.Value;
            //return metricValuesQuery;
            //end

            #region old code

            // LINQ Query
            //            var metricValuesQuery = vmMetricList.MetricCollection.Value.FirstOrDefault().MetricValues.Select(metricValue => metricValue.Total.Value);
            //            var metricValuesQuery = vmMetricList.MetricCollection.Value.FirstOrDefault().MetricValues.Select(metricValue => metricValue.Total.Value);

            //if (currentTime != latestTime)
            //{
            //    currentTime = latestTime;
            //var metricValuesQuery = vmMetricList;

            //MetricDefinitionListResponse list = GetAvailableMetricDefinitions(credentials, resourceUri);
            // MetricListResponse list = GetResourceMetrics(credentials, resourceUri, filter, period, duration);
            //return metricValuesQuery.ToArray();
            //return metricValuesQuery;

            #endregion
        }

        public static async Task<string> GetAuthenticationHeader()
        {
            string clientId = "ba041921-3ae0-4ee8-8cfc-cc93376cbba8";
            string tenant = "microsoft.onmicrosoft.com";

            var authContext = new AuthenticationContext(string.Format("https://login.windows.net/{0}", tenant));

            X509Certificate2 cert = null;
            X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
            string certName = "ignitedemo";
            try
            {
                store.Open(OpenFlags.ReadOnly);
                var certCollection = store.Certificates;
                var certs = certCollection.Find(X509FindType.FindBySubjectName, certName, false);
                cert = certs[0];
            }
            finally
            {
                store.Close();
            }

            var certCred = new ClientAssertionCertificate(clientId, cert);
            var token = await authContext.AcquireTokenAsync("https://management.core.windows.net/", certCred);
            return token.AccessToken;
        }

        private static MetricListResponse GetResourceMetrics(TokenCloudCredentials credentials, string resourceUri, string filter, TimeSpan period, string duration)
        {
            var dateTimeFormat = "yyy-MM-ddTHH:mmZ";

            string start = DateTime.UtcNow.Subtract(period).ToString(dateTimeFormat);
            string end = DateTime.UtcNow.ToString(dateTimeFormat);

            // TODO: Make this more robust.
            StringBuilder sb = new StringBuilder(filter);

            if (!string.IsNullOrEmpty(filter))
            {
                sb.Append(" and ");
            }
            sb.AppendFormat("startTime eq {0} and endTime eq {1}", start, end);
            sb.AppendFormat(" and timeGrain eq duration'{0}'", duration);

            using (var client = new InsightsClient(credentials))
            {
                return client.MetricOperations.GetMetrics(resourceUri, sb.ToString());
            }
        }
        private static MetricDefinitionListResponse GetAvailableMetricDefinitions(TokenCloudCredentials credentials, string resourceUri)
        {
            using (var client = new InsightsClient(credentials))
            {
                return client.MetricDefinitionOperations.GetMetricDefinitions(resourceUri, null);
            }
        }
    }
}