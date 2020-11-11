using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_v02.Models
{
    public class Location
    {
        public int Id { get; set; }
        public string StreetName { get; set; }
        public string StreetNumber { get; set; }
        public string City { get; set; }
        public double LongitudeStart { get; set; }
        public double LongitudeEnd { get; set; }
        public double LatitudeStart { get; set; }
        public double LatitudeEnd { get; set; }

        public override string ToString()
        {
            return City + ", " + StreetName + ", " + StreetNumber;
        }
    }
}
