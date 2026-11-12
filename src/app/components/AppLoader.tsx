'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import FadeObserver from './FadeObserver';

export default function AppLoader({ children }: { children: React.ReactNode }) {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const removeTimer = setTimeout(() => setVisible(false), 800);
		return () => clearTimeout(removeTimer);
	}, []);

	return (
		<>
			{visible && (
				<div className="app-loader fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
					<Image
						src="/rumcajzlogo.svg"
						alt="Logo Rumcajz"
						width={120}
						height={120}
						priority
						className="animate-pulse invert"
					/>
				</div>
			)}
			<FadeObserver />
			{children}
		</>
	);
}
