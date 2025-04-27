import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Artist } from './Artist.schema';
import { Schema as MongooseSchema } from 'mongoose';

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

    @Prop({ required: true, default: 0 })
    averageRating: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
