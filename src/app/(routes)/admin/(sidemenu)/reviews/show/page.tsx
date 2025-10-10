"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  StarIcon,
  CalendarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react";
import { format, isValid, parse } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewData {
  userName: string;
  email: string;
  type: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  image: string[];
  reply: string;
  productName: string; // Assuming this is part of the data, add if not
}

const ReviewspageShow = ({ setIsSheetOpen, setRefetch, IdData }: any) => {
  const [showData, setShowData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/reviews/show/${id}`;
      try {
        const res = await fetch(url, { method: "GET" });
        const responseData = await res.json();
        if (responseData.code === 0 && responseData.data) {
          setShowData(responseData.data);
        } else {
          console.error("Invalid data received:", responseData);
        }
      } catch (error) {
        console.error("Error fetching review data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData(IdData);
  }, [IdData]);

  const toggleCreateDialogs = () => {
    setIsSheetOpen(false);
  };

  const formatDate = (dateString: string) => {
    const parsedDate = parse(dateString, "do MMMM yyyy, hh:mm a", new Date());
    return isValid(parsedDate) ? format(parsedDate, "PPP") : "Invalid Date";
  };
  const ReviewContent = () => (
    <>
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={
              showData?.profilePicture
                ? showData?.profilePicture
                : `https://api.dicebear.com/6.x/initials/svg?seed=${showData?.userName}`
            }
          />
          <AvatarFallback>{showData?.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{showData?.userName}</h2>
          <p className="text-sm text-gray-500">
            Reviewed {showData?.productName}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-5 w-5 ${
              i < (showData?.rating || 0)
                ? "text-gray-500 fill-gray-500"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="text-lg font-medium ml-2">{showData?.rating}/5</span>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-800">{showData?.comment}</p>
      </div>

      {showData?.image && showData.image.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Review Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {showData.image.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review Image ${index + 1}`}
                className=" h-24 w-28 object-cover p-1 rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      )}

      {showData?.reply && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Reply</h3>
          <p className="text-gray-800">{showData.reply}</p>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          {formatDate(showData?.createdAt || "")}
        </div>
        <Badge variant={showData?.isApproved ? "success" : "destructive"}>
          {showData?.isApproved ? (
            <>
              <ThumbsUpIcon className="h-4 w-4 mr-1" /> Approved
            </>
          ) : (
            <>
              <ThumbsDownIcon className="h-4 w-4 mr-1" /> Not Approved
            </>
          )}
        </Badge>
      </div>
    </>
  );

  const SkeletonLoader = () => (
    <>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-5" />
        ))}
        <Skeleton className="h-6 w-12 ml-2" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>
    </>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-start">
          Review Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? <SkeletonLoader /> : <ReviewContent />}
      </CardContent>
    </Card>
  );
};

export default ReviewspageShow;
