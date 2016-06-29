# ko-griddle-engine
A grid-based game engine for KnockoutJS (KO). Uses observables to render grid component. Templates are used for cell contents. Help method to retreive an image based on the current item and a lookup dictionary of tiles.

# Current features
- EngineVM - viewmodel class for game engine
- start()/stop() API couples with frameRate() to track frames and timing
- afterAdvance() optional frame event handler to process game logic each frame
- gridComponent() - access grid component from EngineVM
- gridComponent().setCell(row, col, data) - set data for a cell in the grid

# Future development
- Add tile animation api
- Add sprite rendering layer, using absolute position or transform:translate()
