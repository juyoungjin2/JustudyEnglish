// declarations.d.ts

declare module 'react-native-vector-icons/Ionicons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  export default Icon;
}

declare module 'react-native-image-picker' {
  export interface ImageLibraryOptions {
    mediaType: 'photo' | 'video' | 'mixed';
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    // 필요한 옵션 추가
  }

  export interface Asset {
    uri: string;
    width?: number;
    height?: number;
    fileSize?: number;
    type?: string;
    fileName?: string;
    // 필요한 필드 추가
  }

  export function launchImageLibrary(
    options: ImageLibraryOptions,
    callback: (response: { didCancel: boolean; errorCode?: string; errorMessage?: string; assets?: Asset[] }) => void
  ): void;
}
