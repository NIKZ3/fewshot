import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
	const [hasPermission, setHasPermission] = React.useState<boolean | null>(
		null
	);
	const ref = React.createRef<Camera>();
	const [currentImage, setcurrentImage] = React.useState<string | null>(null);

	React.useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={{ flex: 1 }}>
			{currentImage ? (
				<View style={{ flex: 1 }}>
					<Ionicons
						name="md-arrow-back"
						size={30}
						style={{ padding: 8 }}
						onPress={() => setcurrentImage(null)}
					/>
					<Image
						source={{ uri: currentImage }}
						style={{ flex: 1 }}
						resizeMode="contain"
					/>
					<TouchableOpacity
						style={{
							alignSelf: 'center',
							alignItems: 'center',
							marginBottom: 16,
							backgroundColor: 'white',
							borderRadius: 4,
							padding: 6,
							paddingHorizontal: 24,
							elevation: 2,
						}}
						onPress={() => {}}
					>
						<Text style={{ color: '#416ce1' }}>Send</Text>
					</TouchableOpacity>
				</View>
			) : (
				<Camera style={{ flex: 1 }} type={'back'} ref={ref} ratio="1:1">
					<View
						style={{
							flex: 1,
							backgroundColor: 'transparent',
							flexDirection: 'row',
							justifyContent: 'center',
							marginBottom: 40,
						}}
					>
						<TouchableOpacity
							style={{
								alignSelf: 'flex-end',
								alignItems: 'center',
								marginBottom: 16,
								backgroundColor: 'white',
								borderRadius: 4,
								padding: 6,
								paddingHorizontal: 24,
							}}
							onPress={() =>
								ref.current?.takePictureAsync({
									onPictureSaved: (pic) => {
										setcurrentImage(pic.uri);
									},
								})
							}
						>
							<Text style={{ color: '#416ce1' }}>Capture</Text>
						</TouchableOpacity>
					</View>
				</Camera>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
