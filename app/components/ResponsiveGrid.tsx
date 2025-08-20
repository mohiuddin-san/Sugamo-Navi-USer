import React from 'react';
import { useResponsiveGrid } from '../hooks/useResponsiveGrid';

interface GridProps {
	columns: string; // "48 200 500" のような文字列
	rows: string; // "100 500" のような文字列
	gap?: number;
	isMobile?: boolean;
	className?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * レスポンシブグリッドコンポーネント
 * 使用例:
 * <ResponsiveGrid columns="150 300 150" rows="80 200 80" gap={16}>
 *   {children}
 * </ResponsiveGrid>
 */
export const ResponsiveGrid: React.FC<GridProps> = ({
	columns,
	rows,
	gap = 16,
	isMobile = false,
	className = '',
	children,
	style = {},
}) => {
	const { grid } = useResponsiveGrid();
	const gridStyles = grid(columns, rows, gap, isMobile);

	return (
		<div
			className={className}
			style={{
				...gridStyles,
				...style,
			}}
		>
			{children}
		</div>
	);
};

interface GridItemProps {
	column: number;
	row: number;
	columnSpan?: number;
	rowSpan?: number;
	zIndex?: number;
	className?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * グリッドアイテムコンポーネント
 * 使用例:
 * <GridItem column={1} row={1} columnSpan={2} zIndex={10}>
 *   コンテンツ
 * </GridItem>
 */
export const GridItem: React.FC<GridItemProps> = ({
	column,
	row,
	columnSpan = 1,
	rowSpan = 1,
	zIndex,
	className = '',
	children,
	style = {},
}) => {
	const { item } = useResponsiveGrid();
	const itemStyles = item(column, row, columnSpan, rowSpan, zIndex);

	return (
		<div
			className={className}
			style={{
				...itemStyles,
				...style,
			}}
		>
			{children}
		</div>
	);
};
