build:
  cd lib && wasm-pack build
  cd plugin && pnpm install
  cd plugin && pnpm run build
