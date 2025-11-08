from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import sympy as sp
import networkx as nx
from sympy.parsing.sympy_parser import parse_expr
import json

app = FastAPI(title="KAIROS 2.0 Backend API", version="2.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConceptRequest(BaseModel):
    object_class: str
    confidence: float
    context: str = ""


class ConceptResponse(BaseModel):
    concepts: List[Dict[str, Any]]
    overlays: List[Dict[str, Any]]
    modules: List[Dict[str, Any]]


# Knowledge base mapping objects to scientific concepts
CONCEPT_DATABASE = {
    "plant": {
        "concepts": [
            {
                "name": "Photosynthesis",
                "category": "biology",
                "formulas": ["6CO2 + 6H2O + light → C6H12O6 + 6O2"],
                "overlays": [
                    {"type": "flow", "from": "CO2", "to": "O2", "color": "green"},
                    {"type": "label", "text": "Chlorophyll", "position": "leaf"},
                    {"type": "arrow", "direction": "up", "label": "Transpiration"}
                ]
            },
            {
                "name": "Diffusion",
                "category": "chemistry",
                "formulas": ["J = -D * (dC/dx)"],
                "overlays": [
                    {"type": "particles", "movement": "random", "color": "blue"},
                    {"type": "gradient", "from": "high", "to": "low"}
                ]
            },
            {
                "name": "Osmosis",
                "category": "biology",
                "formulas": ["π = iMRT"],
                "overlays": [
                    {"type": "membrane", "semipermeable": True},
                    {"type": "flow", "substance": "water", "direction": "in"}
                ]
            }
        ]
    },
    "bicycle": {
        "concepts": [
            {
                "name": "Torque",
                "category": "physics",
                "formulas": ["τ = r × F", "τ = I * α"],
                "overlays": [
                    {"type": "vector", "from": "pedal", "rotation": True, "color": "red"},
                    {"type": "arc", "radius": "r", "force": "F"},
                    {"type": "label", "text": "τ = r × F", "position": "pedal"}
                ]
            },
            {
                "name": "Angular Momentum",
                "category": "physics",
                "formulas": ["L = I * ω", "L = r × p"],
                "overlays": [
                    {"type": "rotation", "axis": "wheel", "color": "purple"},
                    {"type": "vector", "circular": True, "label": "ω"}
                ]
            },
            {
                "name": "Mechanical Advantage",
                "category": "physics",
                "formulas": ["MA = output force / input force", "MA = r2 / r1"],
                "overlays": [
                    {"type": "gear_ratio", "input": "pedal", "output": "wheel"},
                    {"type": "label", "text": "Gear Ratio", "position": "chain"}
                ]
            },
            {
                "name": "Friction",
                "category": "physics",
                "formulas": ["f = μ * N"],
                "overlays": [
                    {"type": "heatmap", "zones": ["tire", "brake"], "color": "orange"},
                    {"type": "vector", "direction": "opposite", "label": "Friction Force"}
                ]
            }
        ]
    },
    "bottle": {
        "concepts": [
            {
                "name": "Volume & Surface Area",
                "category": "geometry",
                "formulas": ["V = π * r² * h", "SA = 2πr² + 2πrh"],
                "overlays": [
                    {"type": "dimension", "labels": ["r", "h"], "color": "cyan"},
                    {"type": "highlight", "area": "surface", "opacity": 0.3}
                ]
            },
            {
                "name": "Pressure",
                "category": "physics",
                "formulas": ["P = F / A", "P = ρgh"],
                "overlays": [
                    {"type": "stress_points", "color": "red", "intensity": "high"},
                    {"type": "gradient", "from": "bottom", "to": "top", "label": "Pressure"}
                ]
            },
            {
                "name": "Material Properties",
                "category": "engineering",
                "formulas": ["σ = E * ε"],
                "overlays": [
                    {"type": "material_highlight", "property": "elasticity"},
                    {"type": "label", "text": "Stress Points", "critical_zones": True}
                ]
            }
        ]
    },
    "ball": {
        "concepts": [
            {
                "name": "Projectile Motion",
                "category": "physics",
                "formulas": ["y = x*tan(θ) - (g*x²)/(2*v₀²*cos²(θ))", "R = (v₀²*sin(2θ))/g"],
                "overlays": [
                    {"type": "trajectory", "path": "parabolic", "color": "yellow"},
                    {"type": "vector", "components": ["vx", "vy"], "decompose": True}
                ]
            },
            {
                "name": "Elastic Collision",
                "category": "physics",
                "formulas": ["½mv₁² + ½mv₂² = ½mv₁'² + ½mv₂'²"],
                "overlays": [
                    {"type": "impact_zone", "color": "red"},
                    {"type": "energy_transfer", "visual": "wave"}
                ]
            }
        ]
    },
    "car": {
        "concepts": [
            {
                "name": "Newton's Laws",
                "category": "physics",
                "formulas": ["F = ma", "F₁₂ = -F₂₁"],
                "overlays": [
                    {"type": "force_diagram", "vectors": ["weight", "normal", "friction"]},
                    {"type": "acceleration_arrow", "color": "green"}
                ]
            },
            {
                "name": "Thermodynamics",
                "category": "physics",
                "formulas": ["η = W/Qh", "PV = nRT"],
                "overlays": [
                    {"type": "heat_flow", "from": "engine", "color": "red"},
                    {"type": "label", "text": "Combustion", "position": "engine"}
                ]
            }
        ]
    }
}

# Expanded topic catalog (Math / Physics / Chemistry) with notes and external Byju's links
def byjus_search_link(topic_name: str) -> str:
    # Simple link to Byju's search for the topic (safe fallback)
    return f"https://www.byjus.com/search/?q={topic_name.replace(' ', '+')}"

TOPICS_DATABASE = {
    "math": [
        {
            "name": "Algebra - Linear Equations",
            "category": "math",
            "notes": "Linear equations, methods of solution, graphing lines, systems of equations.",
            "formulas": ["ax + b = 0", "y = mx + c"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("linear equations")
        },
        {
            "name": "Algebra - Quadratic Equations",
            "category": "math",
            "notes": "Standard form ax^2 + bx + c = 0, factoring, completing the square, quadratic formula.",
            "formulas": ["x = (-b ± sqrt(b^2 - 4ac)) / (2a)"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("quadratic equations")
        },
        {
            "name": "Calculus - Derivatives",
            "category": "math",
            "notes": "Rate of change, differentiation rules (product, quotient, chain), applications to maxima/minima.",
            "formulas": ["d/dx x^n = n x^{n-1}"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("derivative")
        },
        {
            "name": "Calculus - Integrals",
            "category": "math",
            "notes": "Antiderivatives, definite and indefinite integrals, area under curve, fundamental theorem of calculus.",
            "formulas": ["∫ x^n dx = x^{n+1} / (n+1) + C"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("integrals")
        },
        {
            "name": "Trigonometry",
            "category": "math",
            "notes": "Sine, cosine, tangent, identities, unit circle, solving triangles.",
            "formulas": ["sin^2 θ + cos^2 θ = 1", "tan θ = sin θ / cos θ"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("trigonometry")
        },
        {
            "name": "Probability & Statistics",
            "category": "math",
            "notes": "Basic probability, combinatorics, mean/median/mode, standard deviation.",
            "formulas": ["P(A) = favorable / total"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("probability")
        }
    ],
    "physics": [
        {
            "name": "Kinematics",
            "category": "physics",
            "notes": "Motion in one and two dimensions, velocity, acceleration, equations of motion.",
            "formulas": ["v = u + at", "s = ut + 1/2 a t^2"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("kinematics")
        },
        {
            "name": "Dynamics & Newton's Laws",
            "category": "physics",
            "notes": "Force, mass, acceleration, free-body diagrams, friction, circular motion.",
            "formulas": ["F = ma", "τ = r × F"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("newton's laws")
        },
        {
            "name": "Energy & Work",
            "category": "physics",
            "notes": "Kinetic/potential energy, work-energy theorem, conservation of energy.",
            "formulas": ["KE = 1/2 mv^2", "W = F · d"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("work and energy")
        },
        {
            "name": "Thermodynamics",
            "category": "physics",
            "notes": "Laws of thermodynamics, heat transfer, ideal gases, PV diagrams.",
            "formulas": ["PV = nRT", "ΔU = Q - W"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("thermodynamics")
        },
        {
            "name": "Electricity & Magnetism",
            "category": "physics",
            "notes": "Coulomb's law, electric fields, circuits, magnetic fields, Faraday's law.",
            "formulas": ["V = IR", "∇ × E = -∂B/∂t"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("electricity and magnetism")
        }
    ],
    "chemistry": [
        {
            "name": "Atomic Structure",
            "category": "chemistry",
            "notes": "Protons, neutrons, electrons, electronic configuration, isotopes.",
            "formulas": [],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("atomic structure")
        },
        {
            "name": "Periodic Table",
            "category": "chemistry",
            "notes": "Trends across periods/groups: electronegativity, atomic radius, ionization energy.",
            "formulas": [],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("periodic table")
        },
        {
            "name": "Chemical Bonding",
            "category": "chemistry",
            "notes": "Ionic, covalent, metallic bonding, polarity, VSEPR shapes.",
            "formulas": [],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("chemical bonding")
        },
        {
            "name": "Stoichiometry",
            "category": "chemistry",
            "notes": "Balancing equations, mole concept, limiting reagent, yield calculations.",
            "formulas": [],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("stoichiometry")
        },
        {
            "name": "Chemical Kinetics",
            "category": "chemistry",
            "notes": "Reaction rates, order of reaction, rate laws, activation energy.",
            "formulas": ["rate = k [A]^n"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("chemical kinetics")
        }
    ]
}


@app.get("/")
async def root():
    return {
        "message": "KAIROS 2.0 Backend API",
        "version": "2.0.0",
        "status": "active"
    }


@app.post("/api/extract-concepts", response_model=ConceptResponse)
async def extract_concepts(request: ConceptRequest):
    """
    Extract scientific concepts from detected objects
    """
    object_class = request.object_class.lower()
    
    # Find matching concepts in database
    concepts_data = CONCEPT_DATABASE.get(object_class, None)
    
    if not concepts_data:
        # Default fallback for unknown objects
        concepts_data = {
            "concepts": [
                {
                    "name": "Structure & Form",
                    "category": "general",
                    "formulas": [],
                    "overlays": [
                        {"type": "outline", "color": "white"},
                        {"type": "label", "text": "Object Detected"}
                    ]
                }
            ]
        }
    
    # Build response
    concepts = []
    overlays = []
    modules = []
    
    for concept in concepts_data["concepts"]:
        concepts.append({
            "id": concept["name"].lower().replace(" ", "_"),
            "name": concept["name"],
            "category": concept["category"],
            "formulas": concept["formulas"]
        })
        
        overlays.extend([{
            "concept_id": concept["name"].lower().replace(" ", "_"),
            **overlay
        } for overlay in concept.get("overlays", [])])
        
        # attempt to enrich module with notes and external links from TOPICS_DATABASE
        module_entry = {
            "id": concept["name"].lower().replace(" ", "_"),
            "title": concept["name"],
            "category": concept["category"],
            "formulas": concept["formulas"],
            "difficulty": "intermediate",
            "notes": None,
            "byjus_link": None
        }

        # find matching topic in TOPICS_DATABASE (simple substring/name match)
        for subj, topics in TOPICS_DATABASE.items():
            for t in topics:
                if t["name"].lower() == concept["name"].lower() or concept["name"].lower() in t["name"].lower():
                    module_entry["notes"] = t.get("notes")
                    module_entry["byjus_link"] = t.get("byjus_link")
                    # prefer explicit difficulty if present
                    module_entry["difficulty"] = t.get("difficulty", module_entry["difficulty"])
                    break
            if module_entry["notes"]:
                break

        modules.append(module_entry)
    
    return ConceptResponse(
        concepts=concepts,
        overlays=overlays,
        modules=modules
    )


@app.post("/api/solve-equation")
async def solve_equation(equation: str, variable: str = "x"):
    """
    Solve mathematical equations using SymPy
    """
    try:
        expr = parse_expr(equation)
        var = sp.Symbol(variable)
        solution = sp.solve(expr, var)
        
        return {
            "equation": equation,
            "variable": variable,
            "solutions": [str(sol) for sol in solution],
            "latex": sp.latex(expr)
        }
    except Exception as e:
        return {
            "error": str(e),
            "equation": equation
        }


@app.get("/api/topics")
async def list_topics(subject: str = None):
    """
    Return the catalog of topics. If subject is provided (math|physics|chemistry), return only that subject.
    """
    if subject:
        subject_key = subject.lower()
        return {subject_key: TOPICS_DATABASE.get(subject_key, [])}
    return TOPICS_DATABASE


@app.post("/api/concept-relationships")
async def get_concept_relationships(concepts: List[str]):
    """
    Build a knowledge graph of concept relationships
    """
    G = nx.Graph()
    
    # Add concepts as nodes
    for concept in concepts:
        G.add_node(concept)
    
    # Define relationships (this is a simplified example)
    relationships = {
        ("photosynthesis", "diffusion"): "requires",
        ("torque", "angular_momentum"): "related_to",
        ("pressure", "volume"): "inverse_relationship",
        ("force", "acceleration"): "proportional_to"
    }
    
    # Add edges
    for (concept1, concept2), relationship in relationships.items():
        if concept1 in concepts and concept2 in concepts:
            G.add_edge(concept1, concept2, relationship=relationship)
    
    # Convert to JSON-serializable format
    graph_data = {
        "nodes": [{"id": node, "label": node.replace("_", " ").title()} for node in G.nodes()],
        "edges": [
            {
                "source": edge[0],
                "target": edge[1],
                "relationship": G.edges[edge].get("relationship", "related")
            }
            for edge in G.edges()
        ]
    }
    
    return graph_data


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "KAIROS 2.0 Backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
