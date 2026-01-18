import { Schema, model, Types } from "mongoose"
import bcrypt from "bcryptjs"
import jwt, { Secret, SignOptions } from "jsonwebtoken"
import { IUser } from "../types/models"

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Name."],
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Please provide email."],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide valid email.",
            ],
            unique: true,
        },
        password: {
            type: String,
            minlength: 8,
        },
        bio: {
            type: String,
            maxlength: 150,
        },
        profileImage: {
            type: String,
            default:
                "https://res.cloudinary.com/dzvci8arz/image/upload/v1711644602/blogmind/profile/default.png", // Note: You might want to update this default URL later
        },
        blogs: [
            {
                type: Schema.Types.ObjectId,
                ref: "Blog",
            },
        ],
        myInterests: [
            {
                type: String,
                maxlength: 20,
            },
        ],
        readArticles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Blog",
            },
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive", "blocked"],
            default: "inactive",
        },
        otp: {
            value: {
                type: String,
            },
            expires: {
                type: Date,
            },
        },
        myAssests: [
            {
                type: String,
                default: [],
            },
        ],
    },
    { timestamps: true },
)

UserSchema.index({ name: 1 })

const preSave = async function (this: any, next: (err?: Error) => void) {
    if (!this.isModified("password")) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(5)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error: any) {
        return next(error)
    }
}

   // FIX: Removed 'next'. Async functions don't need it in modern Mongoose.
    UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(5)
        this.password = await bcrypt.hash(this.password, salt)
    } catch (error: any) {
        throw new Error(error)
    }
})

UserSchema.path("myInterests").validate(function (value: any) {
    return value.length <= 8 
}, "myInterests array exceeds the maximum allowed length")

UserSchema.methods.generateToken = function () {
    const secret: Secret = process.env.JWT_SECRET as jwt.Secret
    const options: SignOptions = {
        expiresIn: process.env.JWT_LIFETIME || "2d" as any,
    }

    return jwt.sign({ userId: this._id }, secret, options)
}

UserSchema.methods.comparePassword = async function (pswrd: string) {
    const isMatch = await bcrypt.compare(pswrd, this.password)
    return isMatch
}

const User = model<IUser>("User", UserSchema)
export default User