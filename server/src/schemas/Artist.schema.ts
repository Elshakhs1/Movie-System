import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Movie } from './Movie.schema';
import { Schema as MongooseSchema } from 'mongoose';



@Schema()
export class Artist extends Document {
    @Prop({ required: true, index: 'text' })
    name: string;



    @Prop({ required: true })
    bio: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ required: true })
    nationality: string;

    @Prop({ required: true })
    type: string;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Movie' })
    featuredIn: Movie[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
