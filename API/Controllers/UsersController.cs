using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IPhotoService _photoService;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public UsersController(IPhotoService photoService, IUserRepository userRepository, IMapper mapper, DataContext context)
        {
            _photoService = photoService;
            _userRepository = userRepository;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet("threads")]
        public async Task<UserDto> GetThreads()
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            return await _context.Users.Where(x => x.UserName == user.UserName).ProjectTo<UserDto>(_mapper.ConfigurationProvider).SingleOrDefaultAsync();
            
        }
        [HttpPost("add-post")]
        public async Task<ActionResult<AddPostDto>> AddPost(AddPostDto postDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if(user == null) {return BadRequest("User null"); }
            Post newPost = new Post
            {
                OwnerPostId = postDto.Owner,
                Title = postDto.Title,
                ContentText = postDto.Content
            };
            user.Posts.Add(newPost);

            if(await _userRepository.SaveAllAsync()) return postDto;

            return BadRequest("Problem adding post");
        }

        [HttpPost("add-photo/{id}")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(int id, IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if(user == null) { return NotFound();}

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                PostId = id
            };

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync()) return _mapper.Map<PhotoDto>(photo);

            return BadRequest("Problem adding photo");
        }
    }
}