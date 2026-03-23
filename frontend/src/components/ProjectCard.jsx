import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project._id}`} className="block border p-4 rounded shadow hover:bg-gray-100">
    <h2 className="font-bold">{project.name}</h2>
    <p className="text-sm text-gray-600">{project.description}</p>
  </Link>
);

export default ProjectCard;