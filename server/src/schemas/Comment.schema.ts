
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Movie } from './Movie.schema';
import { User } from './User.schema';
import { Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Comment extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie' })
    movieId: Movie;


    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ required: true, maxLength: 500 })
    text: string;

    @Prop({ required: true, default: Date.now })
    createdAt: Date;

    @Prop({ required: true, default: Date.now })
    updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

