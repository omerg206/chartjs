declare namespace Chart {
  interface CommonAxe {
   realtime?: {
     duration?: number
      ttl?: number,
     refresh?: number,
     delay?: number,
     frameRate?: number,
     pause?: boolean
     onRefresh?: Function
   }
 }
}
