# LumaFlow
LumaFlow: A tool for the disillusioned few who want to tinker with broken systems, slap together prototypes, and pretend they’re building something revolutionary, all while staying one step away from corporate control.
It’s an open-source flowsheet editor in its early stages, designed to let you prototype, test, and break systems. The defining features: Attaching scripts to nodes. Yeah. That's about it. 

It's a tool, not a product. It's not polished. 

## Features (Working on them...)

- **Drag-and-Drop Interface**: Build systems with the ease you deserve. 
- **Cross-Domain Collaboration**: Different domains, one platform. Chemistry? Engineering? Education? Mix it all up.
- **Python Script Integration**: Because you control the logic. Use Python scripts to add the complexity you need. 
- **Real-Time Collaboration**: No more endless email chains. Work with others, but in a way that doesn’t slow you down. 
- **Containerized Execution**: Keeps your code isolated. Keeps your mess isolated. 
- **Open-Source**: We’re not here to own you. This is yours to mold and break. Contribute or leave it; it doesn’t matter.

## Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) – Compartimenalization made easy. Just like how things should be.
- **Backend**: [Flask](https://flask.palletsprojects.com/en/2.0.x/) – No bloat, no fluff. Gets the job done.
- **Real-Time Collaboration**: [Yjs](https://yjs.dev/) – When we get it working, it will allow you to collaborate on flowcharts.
- **Graph Visualization**: [MaxGraph](https://maxgraph.org/) – Make sense of the chaos, without getting lost in it.
- **Containerization**: [Docker](https://www.docker.com/) (?) – Keep your runtime clean.
- **Database**: SQL – It’s simple, it works, and it’s yours.

## Installation (For the Brave)

LumaFlow is a work in progress. Don’t expect a smooth ride, but if you’re into it, you’re in the right place.

### Prerequisites

1. Python 3.x
2. Node.js and npm (for frontend dependencies)
3. Docker (for containerized script execution)
4. PostgreSQL or MySQL (for SQL database)

### Steps

You should be able to figure this out. 

Hint: "npm install" and "npm run dev" in frontend/. 
Hint: Make a venv, and "pip install -r requirements.txt"
Hint: "Flask run --debug" in LumaFlow directory (above app/). 

## License

LumaFlow is licensed under the **GPLv3**.

## Contributing

1. Fork the repo.
2. Make your changes. It doesn’t need to be pretty.
3. Commit them (`git commit -am 'fix or feature'`).
4. Push it.
5. Submit a pull request if you dare.

This is a non-political meritocracy. 

## Roadmap (Rough)

- [ ] Get drag-and-drop working without it falling apart.
- [ ] Get the python script containerization / integration working.
- [ ] Start working on more domain libraries. 
- [ ] Get real-time collaboration working, if that makes sense. 
- [ ] Interface is ugly. 
- [ ] Build features that make sense. 

## Acknowledgements

Here’s what this is using:

- **SvelteKit**: Because fast is better than slow.
- **Flask**: Doesn’t need a reason to exist. It just works.
- **Yjs**: For when we get around to real-time collaboration.
- **MaxGraph**: Because sometimes graphs make sense.
- **Docker**: For keeping it all nice and isolated.
- [**Monaco**](https://microsoft.github.io/monaco-editor/): For editing component codes.
- [**xterm**](https://www.npmjs.com/package/xterm): Hey we gotta have some interface to the container?

---

LumaFlow is about doing it your way. And right now, it’s only for the ones who want to work on a broken system. If you want to help, go ahead. If not, don’t waste your time.

---

No Discord. No Twitter. If you want to reach out, open an issue on GitHub or fork the repo. 
