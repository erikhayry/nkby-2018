export default Marker = () =>
    <MarkerWithLabel
        key={key}
        position={position}
        labelAnchor={{x: 0, y: 0}}
        labelStyle={{
            backgroundColor: "yellow",
            fontSize: "14px",
            padding: "16px",
            visibility: key === activeMarker ? 'visible' : 'hidden'
        }}
        zIndex={key === activeMarker ? 1 : 0}
        onClick={() => {
            Router.push(`/?locale=${key}`)
        }}
        onMouseOver={() => {
            this.onSetActiveMarker(key)
        }}
    >
        <div>{name}</div>
    </MarkerWithLabel>