using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly IPhotoService _photoService;
        public ImageController(IPhotoService photoService)
        {
            _photoService = photoService;   
        }
        [HttpGet]
        public async Task<ActionResult> GetImage()
        {
            
            Byte[] b = await System.IO.File.ReadAllBytesAsync(@"./Images/image.jpg");   // You can use your own method over here.         
            return File(b, "image/jpeg");
        }

       

    }
}