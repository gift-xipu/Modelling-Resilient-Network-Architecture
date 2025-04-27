// OSI Layer Information
const osiLayers = [
    {
        name: "Physical Layer",
        description: "Deals with physical connection between devices. Transmits raw binary data.",
        color: "#FF9966",
        facts: [
            "The Physical Layer defines hardware specifications like cables, switches, and network interface cards.",
            "It transmits raw binary data (0s and 1s) over physical medium.",
            "Examples include: Ethernet cables, fiber optics, wireless signals.",
            "Physical layer issues include signal interference and cable damage."
        ]
    },
    {
        name: "Data Link Layer",
        description: "Provides node-to-node data transfer between two devices on the same network.",
        color: "#99CC66",
        facts: [
            "The Data Link Layer breaks data into frames and manages the flow between nodes.",
            "It handles error detection and correction for the Physical Layer.",
            "MAC addresses operate at this layer for uniquely identifying network interfaces.",
            "Switches operate at this layer, forwarding data based on MAC addresses."
        ]
    },
    {
        name: "Network Layer",
        description: "Routes data packets between different networks, handling logical addressing.",
        color: "#6699CC",
        facts: [
            "The Network Layer is responsible for routing packets across networks.",
            "IP (Internet Protocol) addresses operate at this layer.",
            "Routers work at this layer, connecting multiple networks together.",
            "This layer handles packet fragmentation when packets are too large."
        ]
    },
    {
        name: "Transport Layer",
        description: "Ensures complete data transfer with error recovery and flow control.",
        color: "#CC99CC",
        facts: [
            "The Transport Layer ensures end-to-end communication and data integrity.",
            "TCP provides reliable, connection-oriented service with error recovery.",
            "UDP provides fast, connectionless service without guaranteed delivery.",
            "Ports operate at this layer to identify specific applications/services."
        ]
    },
    {
        name: "Session Layer",
        description: "Establishes, manages and terminates connections between applications.",
        color: "#FFCC66",
        facts: [
            "The Session Layer manages communication sessions between applications.",
            "It handles session setup, maintenance, and termination.",
            "This layer can implement checkpointing for long data transfers.",
            "It synchronizes data between different applications and devices."
        ]
    },
    {
        name: "Presentation Layer",
        description: "Translates data between the application and network formats.",
        color: "#66CCCC",
        facts: [
            "The Presentation Layer handles data translation, encryption, and compression.",
            "It converts data formats between applications and the network.",
            "This layer manages data encryption and decryption for secure transmission.",
            "Common formats include JPEG, GIF, MIDI, and other media encodings."
        ]
    },
    {
        name: "Application Layer",
        description: "Provides network services directly to end-users or applications.",
        color: "#FF9999",
        facts: [
            "The Application Layer is closest to the end user, providing network services to applications.",
            "Protocols like HTTP, FTP, SMTP, and DNS operate at this layer.",
            "It provides interfaces for email, web browsing, and file transfers.",
            "This layer can implement resource sharing and remote file access."
        ]
    }
];
