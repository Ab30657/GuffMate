using System.Reflection.Metadata.Ecma335;
using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
	public class AutoMapperProfiles : Profile
	{
		public AutoMapperProfiles()
		{
			CreateMap<AppUser, MemberDto>()
				.ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
				.ForMember(x => x.Interests, opt => opt.MapFrom(src => src.UserInterests.Select(x => x.Interest)));
			CreateMap<Photo, PhotoDto>();
			CreateMap<Interest, InterestDto>();
			CreateMap<RegisterDto, AppUser>();
			CreateMap<ProfileCompleteDto, AppUser>();
		}
	}
}