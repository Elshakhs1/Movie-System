import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Artist } from './Artist.schema';
import { Schema as MongooseSchema } from 'mongoose';
import { Rating } from './Rating.schema';
import { Comment } from './Comment.schema';

@Schema()
export class Movie extends Document {
    @Prop({ required: true, index: 'text' })
    title: string;

    @Prop({ required: true })
    releaseYear: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, type: [String] })
    genres: string[];

    @Prop({ required: true })
    posterUrl: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Artist' })
    director: Artist;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Artist' })
    artists: Artist[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Rating' }] })
    ratings: Rating[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }] })
    comments: Comment[];

    @Prop({ required: true, default: 0 })
    averageRating: number;

    @Prop({ type: Number, default: 0 })
    duration: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
