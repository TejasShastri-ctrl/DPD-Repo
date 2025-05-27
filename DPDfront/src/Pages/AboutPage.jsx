import React from 'react';
import { FaLightbulb, FaUsers, FaCogs } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 px-6 sm:px-12 lg:px-24 py-16">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
          About
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-600">
          Digital communication and version management platform for production and quality assurance members
        </p>
      </section>

      {/* Core Values / What We Do */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 mb-24">
        <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
          <FaLightbulb className="mx-auto text-indigo-600 text-5xl mb-5" />
          <h3 className="text-2xl font-semibold mb-3">Version Maintainance</h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Managing and storing versions of models for reference and rollback, ensuring that the latest version is always available.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
          <FaUsers className="mx-auto text-indigo-600 text-5xl mb-5" />
          <h3 className="text-2xl font-semibold mb-3">Approval-based Workflow</h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Approval based workflow between production and QA members, ensuring that all changes are reviewed and approved before being implemented.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
          <FaCogs className="mx-auto text-indigo-600 text-5xl mb-5" />
          <h3 className="text-2xl font-semibold mb-3">Robust Database management</h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Secure DB management for storing and retrieving models, ensuring that all data is protected and easily accessible.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-5xl mx-auto mb-24">
        <h2 className="text-3xl font-bold mb-12 text-center">Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { name: 'Tejas Shastri', role: '22210110'},
            { name: 'Krishnapriya Bandewar', role: '22211528'},
            { name: 'Sumeer Mehta', role: '22211576'},
          ].map((member) => (
            <div key={member.name} className="bg-white shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">
                TY, CSE-AIML
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Technology Stack</h2>
        <div className="flex flex-wrap justify-center gap-8 text-gray-700">
          {[
            'React',
            'Spring Boot',
            'TailwindCSS',
            'Redux',
            'PostgreSQL',
          ].map((tech) => (
            <span
              key={tech}
              className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Future Scope Section */}
<section className="max-w-5xl mx-auto mb-24 bg-white rounded-lg shadow-md p-10">
  <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">Future Scope</h2>
  <ul className="list-disc list-inside text-gray-700 space-y-4 max-w-3xl mx-auto text-left">
    <li>
      <strong>Better 3-D Model Support:</strong> Integrate advanced 3-D model rendering and manipulation capabilities directly within the platform to replace static images, enabling users to visualize, rotate, and annotate models for enhanced review and collaboration.
    </li>
    <li>
      <strong>Cloud Storage Integration:</strong> Implement scalable cloud storage solutions (such as AWS S3 or Azure Blob Storage) to securely store model files and version data, providing high availability, fault tolerance, and easy access from any location.
      Browser security does not allow local file access, so cloud storage is essential for seamless file viewing in-app.
    </li>
    <li>
      <strong>Cloud Hosting & Deployment:</strong> Transition the application backend and frontend to robust cloud hosting environments with continuous integration and deployment pipelines, ensuring seamless scalability, performance optimization, and minimal downtime.
    </li>
    <li>
      <strong>Enhanced Collaboration Tools:</strong> Develop integrated communication and collaboration features, such as real-time chat, comments, and annotations, to facilitate better teamwork between production and QA members.
    </li>
  </ul>
</section>


    </main>
  );
};

export default AboutPage;
