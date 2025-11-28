# Project Plan

## Theme
- [x] Centralize Three.js viewer background
    - [x] Define CSS variable `--three-bg` in `src/style.css`
    - [x] Export `AppConfig.threeBackground` in `src/config.ts`
    - [ ] Update scenes to use resolved background
        - [ ] Update `src/models/rotateBox.ts`
        - [ ] Update `src/models/earthAndSun.ts`
        - [ ] Update other scenes in `src/models/`

## GPU Picking Fix
- [ ] Fix rotation bug (done)
- [ ] Fix highlighting bug
    - [ ] Disable texture filtering (NearestFilter)
    - [ ] Disable mipmaps
    - [ ] Use NoColorSpace for picking texture
    - [ ] Verify ID encoding/decoding
