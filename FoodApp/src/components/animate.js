import {
    View, Text, ScrollView, StatusBar, TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon } from "react-native-heroicons/mini";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Loading from "./loading";
import YoutubePlayer from "react-native-youtube-iframe";
import { CachedImage } from "../helpers/image";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    const [isFavourite, setIsFavourite] = useState(false);
    const navigation = useNavigation();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    // Shared animation value
    const scaleAnim = useSharedValue(0);

    // Animated styles for the image
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(scaleAnim.value, {
                        duration: 1000, // 1 second duration for smooth transition
                    }),
                },
            ],
            opacity: withTiming(scaleAnim.value, { duration: 1000 }), // Fade in the image
        };
    });

    // Fetch the meal data when the component mounts
    useEffect(() => {
        getMealData(item.idMeal);
    }, []);

    // Start the animation when data is loaded
    useEffect(() => {
        if (meal) {
            scaleAnim.value = 1; // Animate the image once the meal data is loaded
        }
    }, [meal]);

    const getMealData = async (id) => {
        try {
            const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            if (response && response.data) {
                setMeal(response.data.meals[0]);
                setLoading(false);
            }
        } catch (error) {
            console.log('error: ', error.message);
        }
    };

    const getIngredients = (meal) => {
        if (!meal) return [];
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal['strIngredient' + i]) {
                ingredients.push({
                    ingredient: meal['strIngredient' + i],
                    measure: meal['strMeasure' + i],
                });
            }
        }
        return ingredients;
    };

    const getYoutubeVideoId = (url) => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);

        if (match && match[1]) {
            return match[1];
        }
        return null;
    };

    return (
        <ScrollView
            className="bg-white flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            <StatusBar translucent backgroundColor="transparent" style="light-content" />

            {/* Recipe Image with Animation */}
            <Animated.View style={[{ justifyContent: 'center' }, animatedStyle]}>
                <CachedImage
                    uri={item.strMealThumb}
                    style={{
                        width: wp(98),
                        height: hp(50),
                        borderRadius: 30,
                        marginTop: 4,
                    }}
                    className="bg-black/5"
                />
            </Animated.View>

            {/* Back button and Favorite button */}
            <View className="w-full absolute flex-row justify-between items-center pt-14">
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white p-2 rounded-full ml-5">
                    <ChevronLeftIcon size={hp(4.5)} strokeWidth={4.5} color="#fbbf42" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)} className="bg-white p-2 rounded-full mr-5">
                    <HeartIcon size={hp(4.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                </TouchableOpacity>
            </View>

            {/* Meal description */}
            {loading ? (
                <Loading className="mt-16" size="large" />
            ) : (
                <View className="px-4 flex justify-between pt-8 space-y-4">
                    <Text style={{ fontSize: hp(3) }} className="font-bold text-neutral-700">
                        {meal?.strMeal}
                    </Text>
                    <Text style={{ fontSize: hp(2) }} className="font-medium text-neutral-500">
                        {meal?.strArea}
                    </Text>

                    {/* Additional meal details... */}
                </View>
            )}
        </ScrollView>
    );
}
