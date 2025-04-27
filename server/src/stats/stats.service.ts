import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating } from '../schemas/Rating.schema';
import { User } from '../schemas/User.schema';
import { Movie } from '../schemas/Movie.schema';

// Define interfaces for the demographic stats results
export interface AgeGroupStat {
  ageGroup: string;
  averageRating: number;
}

export interface GenderStat {
  gender: string;
  averageRating: number;
}

export interface CountryStat {
  country: string;
  averageRating: number;
}

// Union type for all possible stat results
export type DemographicStat = AgeGroupStat | GenderStat | CountryStat;

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  async getRatingStats(movieId: string, groupBy: string): Promise<DemographicStat[]> {
    // Check if movie exists
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Get all ratings for this movie
    const ratings = await this.ratingModel.find({ movieId }).exec();
    if (ratings.length === 0) {
      return [];
    }

    // Get all users who rated this movie
    const userIds = ratings.map(rating => rating.userId);
    const users = await this.userModel.find({ _id: { $in: userIds } }).exec();

    // Create a map of user IDs to their demographic info
    const userMap = new Map<string, {age?: number, gender?: string, country?: string}>();
    users.forEach(user => {
      // Cast _id to string 
      userMap.set(String(user._id), {
        age: user.age,
        gender: user.gender,
        country: user.country,
      });
    });

    // Group ratings by demographic data
    const groupedRatings = new Map();
    
    ratings.forEach(rating => {
      const userId = String(rating.userId);
      const userInfo = userMap.get(userId);
      
      if (!userInfo) return;
      
      let groupValue = '';
      
      // Determine the group value based on the groupBy parameter
      if (groupBy === 'age') {
        if (!userInfo.age) return;
        
        // Group ages into ranges
        if (userInfo.age < 18) groupValue = 'under-18';
        else if (userInfo.age >= 18 && userInfo.age <= 25) groupValue = '18-25';
        else if (userInfo.age >= 26 && userInfo.age <= 35) groupValue = '26-35';
        else if (userInfo.age >= 36 && userInfo.age <= 50) groupValue = '36-50';
        else groupValue = 'over-50';
      } else if (groupBy === 'gender') {
        if (!userInfo.gender) return;
        groupValue = userInfo.gender;
      } else if (groupBy === 'country') {
        if (!userInfo.country) return;
        groupValue = userInfo.country;
      }
      
      if (!groupValue) return;
      
      if (!groupedRatings.has(groupValue)) {
        groupedRatings.set(groupValue, {
          totalScore: 0,
          count: 0,
        });
      }
      
      const group = groupedRatings.get(groupValue);
      group.totalScore += rating.score;
      group.count += 1;
    });
    
    // Calculate average ratings for each group
    const results: DemographicStat[] = [];
    
    groupedRatings.forEach((value, key) => {
      const averageRating = (value.totalScore / value.count).toFixed(1);
      
      if (groupBy === 'age') {
        results.push({ ageGroup: key, averageRating: parseFloat(averageRating) });
      } else if (groupBy === 'gender') {
        results.push({ gender: key, averageRating: parseFloat(averageRating) });
      } else if (groupBy === 'country') {
        results.push({ country: key, averageRating: parseFloat(averageRating) });
      }
    });
    
    return results;
  }
} 