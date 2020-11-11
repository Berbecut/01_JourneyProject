using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_v02.Models;

namespace Project_v02
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {

        private readonly myDBContext _context;

        // create controller to create pdf and retrieve the data from DB
        private readonly IHostingEnvironment _hostingEnvironment;
        public PdfController(IHostingEnvironment hostingEnvironment, myDBContext context)
        {
            _hostingEnvironment = hostingEnvironment; // create pdf file
            _context = context; // retrieve data from DB
        }

        [HttpPost]
        [Route("/api/pdf")]
        public async Task<ActionResult> pdfAsync(Report report)
        {
            var name = HttpContext.Request.Query["name"].ToString();
            var path = _hostingEnvironment.WebRootPath + "\\MyPages\\pdf\\" + report.LicensePlate + ".pdf";

            var doc = new Document(PageSize.A4.Rotate()); // added Rotate() function for landscape

            using (var fs = new FileStream(path, FileMode.Create))  // this function will close the connection in order to create another report
            { 

            var writer = PdfWriter.GetInstance(doc, fs);

            var baseFontHeader = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, false);
            var fontHeader = new Font(baseFontHeader, 22, Font.BOLD, BaseColor.Black);

            var baseFontText = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, false);
            var fontText = new Font(baseFontText, 14, Font.NORMAL, BaseColor.Black);

            doc.Open();

            var image = Image.GetInstance(_hostingEnvironment.WebRootPath + @"\MyPages\img\SkatteverketImg.png");
            image.ScalePercent(25f);
            image.SetAbsolutePosition(55, 540);
            doc.Add(image);


            var header = new Paragraph("Journey document", fontHeader);
            doc.Add(header);


            // retrieve data from database
            var journeyReport = await _context.Journeys
                .Include(x => x.Vehicle)
                .Include(x => x.LocationStart)
                .Include(x => x.LocationStop)
                .Where(x => x.Vehicle.LicensePlate == report.LicensePlate).ToListAsync();


            var text1 = new Chunk("License Plate: " + report.LicensePlate, fontText); // fill License plate
            text1.SetUnderline(1, -1.5f);
            doc.Add(text1);

            var text2 = new Chunk("         Start date: " + report.DateTimeStart.AddHours(2) + "        End date: " + report.DateTimeStop.AddHours(25).AddMinutes(59), fontText); // fill Period in Pdf
            doc.Add(text2);


            //Created a table here
            var table = new Table(8);
             
            table.Padding = 5;
            table.DefaultHorizontalAlignment = 1;
            table.DefaultVerticalAlignment = Element.ALIGN_MIDDLE;
            table.Width=100;

            var JourneyDate = new Cell("JourneyDate");
            JourneyDate.Rowspan = 2;
            JourneyDate.BackgroundColor = BaseColor.Green;
            table.AddCell(JourneyDate);

            var Tachometer = new Cell("Tachometer");
            Tachometer.Colspan = 2;
            Tachometer.BackgroundColor = BaseColor.Green;
            table.AddCell(Tachometer);

            var TotalLength = new Cell("TotalLength");
            TotalLength.Rowspan = 2;
            TotalLength.BackgroundColor = BaseColor.Green;
            table.AddCell(TotalLength);

            var StartAddress = new Cell("StartAddress");
            StartAddress.Rowspan = 2;
            StartAddress.BackgroundColor = BaseColor.Green;
            table.AddCell(StartAddress);

            var Case = new Cell("Case");
            Case.Rowspan = 2;
            Case.BackgroundColor = BaseColor.Green;
            table.AddCell(Case);

            var StopAddress = new Cell("StopAddress");
            StopAddress.Rowspan = 2;
            StopAddress.BackgroundColor = BaseColor.Green;
            table.AddCell(StopAddress);

            var NotesUser = new Cell("NotesUser");
            NotesUser.Rowspan = 2;
            NotesUser.BackgroundColor = BaseColor.Green;
            table.AddCell(NotesUser);

            var StartMeter = new Cell("StartMeter");
            StartMeter.BackgroundColor = BaseColor.Green;
            table.AddCell(StartMeter);

            var StopMeter = new Cell("StopMeter");
            StopMeter.BackgroundColor = BaseColor.Green;
            table.AddCell(StopMeter);



            // how to retrieve the data from SQL ?
            foreach (var item in journeyReport)
            {
                if ((item.DateTime >= report.DateTimeStart.AddHours(2)) && (item.DateTime <= report.DateTimeStop.AddHours(25).AddMinutes(59)))
                {

                    table.AddCell(item.DateTime.ToString());
                    table.AddCell(item.MeterStart.ToString());
                    table.AddCell(item.MeterStop.ToString());
                    table.AddCell(item.TotalLength.ToString());
                    table.AddCell(item.LocationStart.ToString());
                    table.AddCell(item.Case);
                    table.AddCell(item.LocationStop.ToString());
                    table.AddCell(item.Note);
                }

            }

            doc.Add(table);

            doc.Close();

            writer.Close();

            }

            return Ok(path);
        }
    }
}