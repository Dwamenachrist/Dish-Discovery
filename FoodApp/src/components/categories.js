import { View, Text , ScrollView, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';



export default function Categories(props) {
    const { categories, activeCategory, handleChangeCategory} = props;
    return (
        <Animated.View entering={FadeInDown.duration(500).springify()}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{padding: 15}}
                className="space-x-4"
            >
                {
                    categories.map((cat, index)=>{
                        let isActive = cat.strCategory==activeCategory;
                        let activeButtonClass = isActive? 'bg-amber-400': 'bg-black/10'
                        return(
                            <TouchableOpacity
                                key={index}
                                onPress={()=> handleChangeCategory(cat.strCategory)}
                                className="flex items-center space-y-1"
                            >
                                <View className={`rounded-full p-[6px] ${activeButtonClass}`}>
                                    <Image
                                        source={{uri: cat.strCategoryThumb}}
                                        style={{width: hp(6), height: hp(6)}}
                                    />
                                </View>
                                <Text className="text-neutral" style={{fonstSize: hp(1.6)}}>
                                    {cat.strCategory}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        </Animated.View>
    )
}