using Microsoft.Azure;
using Microsoft.Azure.Insights;
using Microsoft.Azure.Insights.Models;
using Microsoft.Azure.Management.ResourceManager;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using WebRole1.Models;

namespace WebRole1.Controllers
{
    public class HomeController : Controller
    {
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

            MetricListResponse value_telemetryvolume = await GetTelemetryVolume();

            int value_noofincidents = random.Next(20, 40);
            double value_activeusers = random.NextDouble(45.12, 51.21);
            double value_traficrequest = random.NextDouble(1.00, 1.50);

            data.telemetryvolume = value_telemetryvolume;
            data.noofincidents = value_activeincidentsovertime;
            data.maxtimetomitigateincidents = value_maxtimetomitigateincidents;
            data.percentageoftimethesystemviolated = 5;
            data.activeincidentsovertime = value_activeincidentsovertime;
            data.activeusers = value_activeusers;
            data.traficrequest = value_traficrequest;
            List<GraphModel> listdata = new List<GraphModel>();
            listdata.Add(data);

            return Json(new { items = listdata, success = true }, JsonRequestBehavior.AllowGet);
        }


        
        public async Task<MetricListResponse> GetTelemetryVolume()

        {
            string token = await GetAuthenticationHeader();

            string subscriptionID = "36dfc234-9a2d-4f33-be43-db6e321dbc2bss";

            TokenCloudCredentials credentials = new TokenCloudCredentials(subscriptionID, token);

            string resourceUri = "/subscriptions/dd0db424-9a49-408d-911e-67e398aaaa3a/resourceGroups/artrejo-scaledemo3/providers/Microsoft.DocumentDB/databaseAccounts/artrejo-scaledemo3";

            //string filter = null;
            TimeSpan period = new TimeSpan(0, 0, 0, 30, 0);
            string filter = "(name.value eq 'Total Requests')";
            MetricListResponse vmMetricList = GetResourceMetrics(credentials, resourceUri, filter, TimeSpan.FromHours(1), "PT5M");

            // LINQ Query
            //            var metricValuesQuery = vmMetricList.MetricCollection.Value.FirstOrDefault().MetricValues.Select(metricValue => metricValue.Total.Value);
            //            var metricValuesQuery = vmMetricList.MetricCollection.Value.FirstOrDefault().MetricValues.Select(metricValue => metricValue.Total.Value);
            //var metricValuesQuery = vmMetricList.MetricCollection.Value.FirstOrDefault().MetricValues;
            //var metricValuesQuery = vmMetricList;


            //MetricDefinitionListResponse list = GetAvailableMetricDefinitions(credentials, resourceUri);
            // MetricListResponse list = GetResourceMetrics(credentials, resourceUri, filter, period, duration);

            //return metricValuesQuery.ToArray();
            return vmMetricList;


        } 

        public static async Task<string> GetAuthenticationHeader()
        {
            string clientId = "ba041921-3ae0-4ee8-8cfc-cc93376cbba8";
            string tenant = "microsoft.onmicrosoft.com";

            var authContext = new AuthenticationContext(string.Format("https://login.windows.net/{0}", tenant));

            X509Certificate2 cert = null;
            X509Store store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
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