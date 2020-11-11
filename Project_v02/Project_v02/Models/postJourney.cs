using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_v02.Models
{
    public class postJourney
    {

        public string LicensePlate { get; set; }
        public DateTime DateTime { get; set; }
        public int MeterStart { get; set; }
        public int MeterStop { get; set; }
        public int TotalLength { get; set; }
        public string CityStart { get; set; }
        public string CityStop { get; set; }
        public string StartAddress { get; set; }
        public string EndAddress { get; set; }
        public string StartNo { get; set; }
        public string EndNo { get; set; }
        public string Case { get; set; }
        public string Note { get; set; }
    }
}
