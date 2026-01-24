'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
    data: string
    width?: number
}

export default function QRCodeGenerator({ data, width = 200 }: Props) {
    const [src, setSrc] = useState<string>('')

    useEffect(() => {
        QRCode.toDataURL(data, { width, margin: 1 }, (err, url) => {
            if (!err) {
                setSrc(url)
            }
        })
    }, [data, width])

    if (!src) return <div className="animate-pulse bg-gray-200" style={{ width, height: width }}></div>

    return (
        <div className="flex flex-col items-center">
            <img src={src} alt="QR Code" width={width} height={width} className="border-4 border-white shadow-sm" />
            <p className="mt-2 text-xs text-gray-500 font-mono break-all max-w-[200px] text-center">{data}</p>
        </div>
    )
}
