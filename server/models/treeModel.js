import mongoose from "mongoose";

const treeSchema = new mongoose.Schema(
    {
        name: String,
        scientificName: String,
        treeType: String,
        location: String,
        description: String,
        features: String,
        maintenance: String,
        benefits: String,
        funFact: String,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Tree", treeSchema);