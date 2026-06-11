import React from 'react';
import { Pressable, View, Text, Image } from 'react-native';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTheme } from '@/hooks/useTheme';
import { Package, Star } from 'lucide-react-native';

export interface Service {
  _id: string;
  name: string;
  imageUrl?: string;
  imageStorageId?: string;
  price: number;
  rating: number;
  reviewCount: number;
}

interface ServiceCardProps {
  service: Service;
  onPress?: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(service._id);
    } else {
      router.push(`/store/${service._id}`);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 250 }}
    >
      <GlassCard onPress={handlePress} style={{ marginBottom: 12 }}>
        {service.imageUrl ? (
          <Image
            source={{ uri: service.imageUrl }}
            resizeMode="cover"
            style={{ height: 140, width: '100%', backgroundColor: colors.surface }}
          />
        ) : (
          <View className="justify-center items-center" style={{ height: 140, backgroundColor: colors.surface }}>
            <Package size={48} color={colors.mutedForeground} />
          </View>
        )}
        <View className="p-3">
          <Text className="text-base font-semibold text-foreground mb-1" numberOfLines={2}>
            {service.name}
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-[10px] font-bold text-accent">{service.price.toLocaleString()} ETB</Text>
            <View className="flex-row items-center gap-0.5">
              <Star size={12} color={colors.chart4} fill={colors.chart4} />
              <Text className="text-xs text-muted-foreground">{service.rating} ({service.reviewCount})</Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </MotiView>
  );
};
