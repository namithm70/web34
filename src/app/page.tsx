import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/lib/ui";
import { ArrowRightIcon, ChartBarIcon, CubeIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const features = [
    {
      icon: <ArrowRightIcon className="w-6 h-6" />,
      title: "Trade",
      description: "Swap tokens with the best rates across multiple DEXs",
      href: "/trade",
      color: "text-blue-600",
    },
    {
      icon: <CubeIcon className="w-6 h-6" />,
      title: "Stake",
      description: "Earn rewards by staking your tokens in our pools",
      href: "/stake",
      color: "text-green-600",
    },
    {
      icon: <BanknotesIcon className="w-6 h-6" />,
      title: "Farm",
      description: "Provide liquidity and earn farming rewards",
      href: "/farm",
      color: "text-purple-600",
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Portfolio",
      description: "Track your positions and earnings in one place",
      href: "/portfolio",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Trade, Stake & Farm
              <span className="block text-blue-600">Non-Custodial DeFi</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the future of decentralized finance with secure, transparent,
              and efficient trading, staking, and farming across multiple blockchains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/trade">
                  Start Trading
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need in DeFi
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive DeFi platform with competitive yields and low fees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-12 h-12 ${feature.color} bg-gray-100 rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$2.4B+</div>
              <div className="text-gray-600">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15%</div>
              <div className="text-gray-600">Average APY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
