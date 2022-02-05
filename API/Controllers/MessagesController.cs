using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[Authorize]
	public class MessagesController : BaseApiController
	{
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IPhotoService _photoService;
		public MessagesController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
		{
			_photoService = photoService;
			_unitOfWork = unitOfWork;
			_mapper = mapper;

		}

		[HttpPost]
		public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
		{
			var username = (await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value)).UserName;
			if (username == createMessageDto.RecipientUsername.ToLower())
				return BadRequest("You cannot send messages to yourself");
			var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
			if (recipient == null) return NotFound();

			var message = new Message
			{
				Sender = sender,
				Recipient = recipient,
				SenderUsername = sender.UserName,
				RecipientUsername = recipient.UserName,
				Content = createMessageDto.Content
			};

			_unitOfWork.MessageRepository.AddMessage(message);
			if (await _unitOfWork.MessageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));
			return BadRequest("Failed to save message!");
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
		{
			messageParams.Username = (await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value)).UserName;
			var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

			Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
			return messages;
		}

		[HttpGet("thread/{username}")]
		public async Task<ActionResult<IEnumerator<MessageDto>>> GetMessageThread(string username)
		{
			var currentUsername = (await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value)).UserName;
			return Ok(await _unitOfWork.MessageRepository.GetMessageThread(currentUsername, username));
		}

		[HttpGet("thread/latest")]
		public async Task<ActionResult<IEnumerable<MessageDto>>> GetLatestMessages()
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			var list = new List<MessageDto>();
			var friends = (await _unitOfWork.FriendsRepository.GetUserFriends(user.Id, new FriendsParams { predicate = "accepted" }));
			foreach (var friend in friends)
			{
				list.Add(await _unitOfWork.MessageRepository.GetLatestMessage(user.UserName, friend.Username)); //adds null to the list if no messages
			}
			return list;

		}

		[HttpPost("upload")]
		public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			var result = await _photoService.AddPhotoAsync(file);
			if (result.Error != null)
			{
				return BadRequest(result.Error.Message);
			}
			PhotoDto p = new PhotoDto
			{
				Url = result.SecureUrl.AbsoluteUri
			};
			return p;

		}
	}
}