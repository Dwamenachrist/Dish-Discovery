import {View, Text, ScrollView, StatusBar, Image, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {ChevronLeftIcon} from "react-native-heroicons/mini";
import {ClockIcon, FireIcon, Square3Stack3DIcon, UsersIcon} from "react-native-heroicons/outline";
import {HeartIcon} from "react-native-heroicons/solid";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import Loading from "./loading";
import YoutubePlayer from "react-native-youtube-iframe";

export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    const [isFavourite, setIsFavourite] = useState(false);
    const navigation = useNavigation();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMealData(item.idMeal);
    }, []);

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
    }

    const getIngredients = (meal) => {
        if (!meal) return [];
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal['strIngredient' + i]) {
                ingredients.push({
                    ingredient: meal['strIngredient' + i],
                    measure: meal['strMeasure' + i]
                });
            }
        }
        return ingredients;
    }

       const getYoutubeVideoId = (url)=>{
       const regex = /[?&]v=([^&]+)/;
       const match = url.match(regex);

       if(match && match[1]){
           return match[1];
       }
       return null;
   }

    return (
        <ScrollView
            className="bg-white flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}
        >
            <StatusBar translucent backgroundColor="transparent" style="light-content" />
            {/* Recipe Image */}
            <View className="flex-row justify-center">
                <Image
                    source={{uri: item.strMealThumb}}
                    style={{
                        width: wp(98), height: hp(50), borderRadius: 30, marginTop: 4
                    }}
                    className="bg-black/5"
                />
            </View>

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
                    {/* Name and area */}
                    <View className="space-y-2">
                        <Text style={{fontSize: hp(3)}} className="font-bold text-neutral-700">
                            {meal?.strMeal}
                        </Text>
                        <Text style={{fontSize: hp(2)}} className="font-medium text-neutral-500">
                            {meal?.strArea}
                        </Text>
                    </View>

                    {/* Meal stats */}
                    <View className="flex-row justify-around pt-1">
                        {/* Time */}
                        <View className="flex rounded-full bg-amber-300 p-3">
                            <View className="bg-white rounded-full flex items-center justify-center">
                                <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252"/>
                            </View>
                            <View className="space-y-1 py-2 flex items-center">
                                <Text style={{fontSize: hp(2)}} className="font-bold text-neutral-700">35</Text>
                                <Text style={{fontSize: hp(1.3)}} className="font-bold text-neutral-700">Mins</Text>
                            </View>
                        </View>

                        {/* Servings */}
                        <View className="flex rounded-full bg-amber-300 p-2">
                            <View className="bg-white rounded-full flex items-center justify-center">
                                <UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252"/>
                            </View>
                            <View className="space-y-1 py-2 flex items-center">
                                <Text style={{fontSize: hp(2)}} className="font-bold text-neutral-700">03</Text>
                                <Text style={{fontSize: hp(1.3)}} className="font-bold text-neutral-700">Servings</Text>
                            </View>
                        </View>

                        {/* Calories */}
                        <View className="flex rounded-full bg-amber-300 p-2">
                            <View className="bg-white rounded-full flex items-center justify-center">
                                <FireIcon size={hp(4)} strokeWidth={2.5} color="#525252"/>
                            </View>
                            <View className="space-y-1 py-2 flex items-center">
                                <Text style={{fontSize: hp(2)}} className="font-bold text-neutral-700">103</Text>
                                <Text style={{fontSize: hp(1.3)}} className="font-bold text-neutral-700">Cal</Text>
                            </View>
                        </View>

                        {/* Difficulty */}
                        <View className="flex rounded-full bg-amber-300 p-2">
                            <View className="bg-white rounded-full flex items-center justify-center">
                                <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="#525252"/>
                            </View>
                            <View className="space-y-1 py-2 flex items-center">
                                <Text style={{fontSize: hp(1.3)}} className="font-bold text-neutral-700">Easy</Text>
                            </View>
                        </View>
                    </View>

                    {/* Ingredients */}
                    <View className="space-y-4">
                        <Text style={{fontSize: hp(2.5)}} className="font-bold text-neutral-700">Ingredients</Text>
                        <View className="space-y-2 ml-3">
                            {getIngredients(meal).map((item, index) => (
                                <View key={index} className="flex-row space-x-4">
                                    <View style={{height: hp(1.5), width: hp(1.5)}} className="bg-amber-300 rounded-full" />
                                    <View className="space-x-2 flex-row">
                                        <Text style={{fontSize: hp(1.7)}} className="font-extrabold text-neutral-600">{item.measure}</Text>
                                        <Text style={{fontSize: hp(1.7)}} className="font-semibold text-neutral-600">{item.ingredient}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Instructions */}
                    <View className="space-y-4">
                        <Text style={{fontSize: hp(2.5)}} className="font-bold text-neutral-700">Instructions</Text>
                        <Text style={{fontSize: hp(1.6)}} className="text-neutral-700">
                            {meal?.strInstructions}
                        </Text>
                    </View>
                    
                    {/* recipe video */}

                        { meal.strYoutube && (
                            <View className={"space-y-4"}>
                                <Text style={{fontSize: hp(2.5)}} className="font-bold text-neutral-700">Recipe Video</Text>

                                <View>
                                <YoutubePlayer
                                  height={300}
                                  videoId={getYoutubeVideoId(meal.strYoutube)}
                                />
                                </View>
                            </View>

                        )
                    }

                </View>
            )}
        </ScrollView>
    )
}