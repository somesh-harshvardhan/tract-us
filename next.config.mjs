/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: function () {
    return [
      {
        source: "/",
        destination: "/contracts",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
