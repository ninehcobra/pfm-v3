export type Grid = (number | null)[][];

export const GRID_SIZE = 4;

export const createEmptyGrid = (): Grid => 
  Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

export const spawnTile = (grid: Grid): Grid => {
  const newGrid = grid.map(row => [...row]);
  const emptyCells = [];
  
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (newGrid[r][c] === null) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) return newGrid;

  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  
  return newGrid;
};

const compress = (row: (number | null)[]): { newRow: (number | null)[], moved: boolean } => {
  const filtered = row.filter(val => val !== null) as number[];
  const newRow: (number | null)[] = [...filtered];
  while (newRow.length < GRID_SIZE) {
    newRow.push(null);
  }
  
  let moved = false;
  for (let i = 0; i < GRID_SIZE; i++) {
    if (newRow[i] !== row[i]) {
      moved = true;
      break;
    }
  }
  
  return { newRow, moved };
};

const merge = (row: (number | null)[]): { newRow: (number | null)[], score: number, merged: boolean } => {
  const newRow: (number | null)[] = [...row];
  let score = 0;
  let merged = false;

  for (let i = 0; i < GRID_SIZE - 1; i++) {
    if (newRow[i] !== null && newRow[i] === newRow[i + 1]) {
      newRow[i] = (newRow[i] as number) * 2;
      score += newRow[i] as number;
      newRow[i + 1] = null;
      merged = true;
    }
  }

  return { newRow, score, merged };
};

const moveLeft = (grid: Grid): { newGrid: Grid, score: number, moved: boolean } => {
  let totalScore = 0;
  let hasMoved = false;

  const newGrid = grid.map(row => {
    const { newRow: compressed, moved: m1 } = compress(row);
    const { newRow: merged, score, merged: m2 } = merge(compressed);
    const { newRow: finalRow, moved: m3 } = compress(merged);
    
    totalScore += score;
    if (m1 || m2 || m3) hasMoved = true;
    return finalRow;
  });

  return { newGrid, score: totalScore, moved: hasMoved };
};

const rotateGrid = (grid: Grid): Grid => {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[c][GRID_SIZE - 1 - r] = grid[r][c];
    }
  }
  return newGrid;
};

export const move = (grid: Grid, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): { newGrid: Grid, score: number, moved: boolean } => {
  let currentGrid = grid.map(row => [...row]);
  let rotations = 0;

  switch (direction) {
    case 'LEFT': rotations = 0; break;
    case 'UP': rotations = 3; break;
    case 'RIGHT': rotations = 2; break;
    case 'DOWN': rotations = 1; break;
  }

  for (let i = 0; i < rotations; i++) currentGrid = rotateGrid(currentGrid);
  
  const { newGrid: processedGrid, score, moved } = moveLeft(currentGrid);
  
  let finalGrid = processedGrid;
  for (let i = 0; i < (4 - rotations) % 4; i++) finalGrid = rotateGrid(finalGrid);

  return { newGrid: finalGrid, score, moved };
};

export const isGameOver = (grid: Grid): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) return false;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
};
