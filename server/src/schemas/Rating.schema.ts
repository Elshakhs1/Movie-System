
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Movie } from './Movie.schema';
import { User } from './User.schema';
import { Schema as MongooseSchema } from 'mongoose';



@Schema()
export class Rating extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie' })
    movieId: Movie;



    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ required: true, min: 1, max: 5 })
    score: number;

    @Prop({ required: true, default: Date.now })
    createdAt: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

