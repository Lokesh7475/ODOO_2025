import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { History } from "../models/history.models.js";
import { Item } from "../models/item.models.js";
import { SwapRequest } from "../models/swaprequests.models.js";

const getDashboardData = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    // Get user's history with populated details
    const userHistory = await History.find({ userId })
        .populate('itemGivenId', 'title description category type size images')
        .populate('itemReceivedId', 'title description category type size images')
        .populate('otherUserId', 'username fullName avatar')
        .populate('swapRequestId', 'isAccepted')
        .sort({ timestamp: -1 }) // Most recent first
        .lean();

    // Organize data in a structured format for React
    const dashboardData = {
        userInfo: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            location: user.location,
            role: user.role,
            email: user.email
        },
        
        statistics: {
            totalTransactions: userHistory.length,
            boughtCount: userHistory.filter(h => h.action === 'bought').length,
            soldCount: userHistory.filter(h => h.action === 'sold').length,
            swappedCount: userHistory.filter(h => h.action === 'swapped').length
        },
        
        history: []
    };

    // Process and add action attribute to each history item
    userHistory.forEach(history => {
        const historyItem = {
            id: history._id,
            action: history.action, // sold/bought/swapped
            timestamp: history.timestamp,
            date: new Date(history.timestamp).toLocaleDateString(),
            time: new Date(history.timestamp).toLocaleTimeString(),
            otherUser: {
                id: history.otherUserId?._id,
                username: history.otherUserId?.username,
                fullName: history.otherUserId?.fullName,
                avatar: history.otherUserId?.avatar
            },
            swapRequestAccepted: history.swapRequestId?.isAccepted
        };

        // Add item details based on action type
        switch (history.action) {
            case 'bought':
                historyItem.item = {
                    id: history.itemReceivedId?._id,
                    title: history.itemReceivedId?.title,
                    description: history.itemReceivedId?.description,
                    category: history.itemReceivedId?.category,
                    type: history.itemReceivedId?.type,
                    size: history.itemReceivedId?.size,
                    images: history.itemReceivedId?.images || []
                };
                historyItem.description = `Bought "${historyItem.item.title}" from ${historyItem.otherUser.fullName}`;
                break;
            
            case 'sold':
                historyItem.item = {
                    id: history.itemGivenId?._id,
                    title: history.itemGivenId?.title,
                    description: history.itemGivenId?.description,
                    category: history.itemGivenId?.category,
                    type: history.itemGivenId?.type,
                    size: history.itemGivenId?.size,
                    images: history.itemGivenId?.images || []
                };
                historyItem.description = `Sold "${historyItem.item.title}" to ${historyItem.otherUser.fullName}`;
                break;
            
            case 'swapped':
                historyItem.itemGiven = {
                    id: history.itemGivenId?._id,
                    title: history.itemGivenId?.title,
                    description: history.itemGivenId?.description,
                    category: history.itemGivenId?.category,
                    type: history.itemGivenId?.type,
                    size: history.itemGivenId?.size,
                    images: history.itemGivenId?.images || []
                };
                historyItem.itemReceived = {
                    id: history.itemReceivedId?._id,
                    title: history.itemReceivedId?.title,
                    description: history.itemReceivedId?.description,
                    category: history.itemReceivedId?.category,
                    type: history.itemReceivedId?.type,
                    size: history.itemReceivedId?.size,
                    images: history.itemReceivedId?.images || []
                };
                historyItem.description = `Swapped "${historyItem.itemGiven.title}" for "${historyItem.itemReceived.title}" with ${historyItem.otherUser.fullName}`;
                break;
        }

        dashboardData.history.push(historyItem);
    });

    res.status(200).json({
        success: true,
        data: dashboardData
    });
});

export { getDashboardData };