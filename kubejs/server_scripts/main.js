// C:/Users/caboy/AppData/Roaming/PrismLauncher/instances/1.21.1/minecraft/kubejs/server_scripts/main.js

console.info('KubeJS Optimizer: Performance layers applied successfully.')

// 1. STREAMS REFLOWING CURRENT OVERRIDE
ServerEvents.tags('entity_type', event => {
    event.get('streamsreflowing:ignores_current').add([
        'alexsmobs:cachalot_whale',
        'alexsmobs:orca'
    ])
})

// 2. STUCK PATHFINDING TRACKER (Fires safely every 2 seconds)
ServerEvents.tick(event => {
    const { server } = event
    
    if (server.tickCount % 40 === 0) {
        // Resolve the level data maps correctly to avoid the ResourceKey loop error
        server.allLevels.forEach(level => {
            // Use a standard for...of loop to safely parse Java collections in KubeJS
            for (let entity of level.entities) {
                
                // Fix for Alex's Mobs: Intercept wandering AI scripts for heavy surface mobs
                if (entity.type.startsWith('alexsmobs:')) {
                    let brain = entity.minecraftEntity
                    if (brain && brain.getNavigation()) {
                        let nav = brain.getNavigation()
                        // Drops complex AI trees if they get jammed against hills or water edges
                        if (nav.isStuck && nav.isStuck()) {
                            nav.stop()
                        }
                    }
                }
                
            }
        })
    }
})
