using Project_v02.Areas.Identity.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_v02.Models
{
    public class Journey
    {
        public int Id { get; set; }
        public DateTime DateTime { get; set; }
        public int MeterStart { get; set; }
        public int MeterStop { get; set; }
        public int  TotalLength { get; set; }
        public string Case { get; set; }
        public string Note { get; set; }
        public Location LocationStart { get; set; }
        public Location LocationStop { get; set; }
        public User User { get; set; }
        public Vehicle Vehicle { get; set; }
    }
}
