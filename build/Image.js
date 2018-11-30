
import * as _ from "lodash";
import * as React from "react";
import {Image as RNImage, Animated, StyleSheet, View, Platform} from "react-native";
import { type ____ImageStyleProp_Internal as ImageStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import type {ImageSourcePropType} from "react-native/Libraries/Image/ImageSourcePropType";

import RNFetchBlob from "rn-fetch-blob";

import CacheManager, {type DownloadOptions} from "./CacheManager";

type ImageProps = {
    style?: ImageStyle,
    defaultSource?: ImageSourcePropType,
    preview?: ImageSourcePropType,
    options?: DownloadOptions,
    uri: string,
    transitionDuration?: number,
    tint?: "dark" | "light"
};

type ImageState = {
    uri: ?string,
    intensity: Animated.Value
};

export default class Image extends React.Component<ImageProps, ImageState> {

    mounted = true;

    static defaultProps = {
        transitionDuration: 300,
        tint: "dark"
    };

    state = {
        uri: undefined,
        intensity: new Animated.Value(1)
    };

    async load({uri, options = {}}: ImageProps): Promise<void> {
        if (uri) {
            const path = await CacheManager.get(uri, options).getPath();
            if (this.mounted) {
                this.setState({ uri: path });
            }
        }
    }

    componentDidMount() {
        this.load(this.props);
    }

    componentDidUpdate(prevProps: ImageProps, prevState: ImageState) {
        const {preview, defaultSource, transitionDuration} = this.props;
        const {uri, intensity} = this.state;
        if (this.props.uri !== prevProps.uri) {
            this.load(this.props);
        } else if (uri && prevState.uri === undefined) {
            Animated.timing(intensity, {
                duration: transitionDuration,
                toValue: 100,
                useNativeDriver: Platform.OS === "android"
            }).start();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render(): React.Node {
        const {preview, style, defaultSource, tint, ...otherProps} = this.props;
        const {uri, intensity} = this.state;
        const hasDefaultSource = !!defaultSource;
        const hasPreview = !!preview;
        const isImageReady = !!uri;
        const opacity = intensity.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1]
        });
        const computedStyle = [
            StyleSheet.absoluteFill,
            _.transform(
                _.pickBy(StyleSheet.flatten(style), (value, key) => propsToCopy.indexOf(key) !== -1),
                // $FlowFixMe
                (result, value, key) => Object.assign(result, { [key]: (value - (style.borderWidth || 0)) })
            )
        ];
        console.log("------>isImageReady=" + isImageReady + ",hasPreview=" + hasPreview + ",uri=" + uri);
        let defaultImage = null;
        if (hasDefaultSource && !hasPreview && !isImageReady) {
        	defaultImage = <RNImage
                            resizeMode="center"
                            source={defaultSource}
                            style={[...style]}
                            {...otherProps}
                        />
        }
        if (hasPreview && !isImageReady) {
        	defaultImage = <RNImage
                            resizeMode="center"
                            source={preview}
                            style={[...style]}
                            {...otherProps}
                        />
        }
        if (isImageReady) {
        	defaultImage = <Animated.View
                style={[...style, {backgroundColor: 'red'}, { opacity }]}
                >
            	<RNImage
                    source={{uri}}
                    style={[...style,computedStyle]}
                    onError={(err)=>{
                        console.warn("file can not load , because " + err.nativeEvent.error + "\n, the rn-img-cache will delete it automaticly")
                        RNFetchBlob.fs.unlink(uri);
                    }}
                    {...otherProps}
                />
            </Animated.View>
        }
        return (
        		defaultImage
        );
    }
}

const black = "black";
const white = "white";
const propsToCopy = [
    "borderRadius", "borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"
];

