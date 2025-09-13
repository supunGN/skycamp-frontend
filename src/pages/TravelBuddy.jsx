import TravelBuddyNavbar from "../components/organisms/TravelBuddyNavbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import CreatePostForm from "../components/molecules/CreatePostForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus as PlusIcon,
  Search as MagnifyingGlassIcon,
  MapPin as MapPinIcon,
  Users as UsersIcon,
  CalendarDays as CalendarDaysIcon,
  Camera as CameraIcon,
  Sparkles as SparklesIcon,
  Tent as TentIcon,
} from "lucide-react";

const mockUsers = [
  { id: 1, name: "John Smith", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 2, name: "Laura Chen", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 3, name: "Sameesha Pasanya", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 4, name: "Isini Sandunika", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 5, name: "Kamal Perera", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 6, name: "Tharindu Silva", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 7, name: "Sarah Johnson", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 8, name: "Michael Brown", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 9, name: "Emma Wilson", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 10, name: "David Lee", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 11, name: "Lisa Garcia", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 12, name: "James Miller", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 13, name: "Anna Davis", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 14, name: "Robert Taylor", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 15, name: "Maria Rodriguez", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 16, name: "Kevin Anderson", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 17, name: "Jennifer White", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 18, name: "Christopher Harris", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 19, name: "Amanda Clark", avatar: "/src/assets/auth/profile-pic.svg" },
  { id: 20, name: "Daniel Lewis", avatar: "/src/assets/auth/profile-pic.svg" },
];

const mockPosts = [
  {
    id: 101,
    user: "Supun Gunathilake",
    time: "2 hours ago",
    location: "Horton Plains",
    activity: "Camping",
    companions: 5,
    dateRange: "Oct 15 - Oct 17",
    description:
      "Looking forward to an epic hike through Horton Plains backcountry! We'll tackle World's End and enjoy breathtaking views. Seeking fit, enthusiastic companions who love nature and are up for a challenge. Bring your own gear—tents, sleeping bags, and sturdy boots recommended. Let's make memories under the stars!",
  },
  {
    id: 102,
    user: "Sameesha Pasanya",
    time: "Yesterday",
    location: "Knuckles Range",
    activity: "Camping",
    companions: 3,
    dateRange: "Nov 01 - Nov 03",
    description:
      "Weekend camping plan to Knuckles. Early morning start, moderate trails, views guaranteed. Looking for easygoing buddies.",
  },
  {
    id: 103,
    user: "Isini Sandunika",
    time: "3 days ago",
    location: "Ella",
    activity: "Camping",
    companions: 2,
    dateRange: "Dec 10 - Dec 12",
    description:
      "Planning a scenic camping trip to Ella Rock. Perfect for beginners with stunning views of tea plantations. Looking for friendly companions to share this beautiful journey.",
  },
  {
    id: 104,
    user: "Kamal Perera",
    time: "1 week ago",
    location: "Sigiriya",
    activity: "Camping",
    companions: 4,
    dateRange: "Jan 15 - Jan 17",
    description:
      "Cultural camping exploration trip to Sigiriya and surrounding ancient sites. Perfect for history enthusiasts and photography lovers. All skill levels welcome!",
  },
  {
    id: 105,
    user: "Tharindu Silva",
    time: "2 weeks ago",
    location: "Mirissa",
    activity: "Camping",
    companions: 6,
    dateRange: "Feb 20 - Feb 22",
    description:
      "Beach camping adventure in Mirissa! Whale watching, surfing lessons, and bonfire nights. Bring your swimwear and positive vibes!",
  },
  {
    id: 106,
    user: "Sarah Johnson",
    time: "3 weeks ago",
    location: "Nuwara Eliya",
    activity: "Stargazing",
    companions: 3,
    dateRange: "Mar 05 - Mar 07",
    description:
      "Tea estate tour and stargazing in the hill country. Cool weather, beautiful landscapes, and authentic Sri Lankan tea experience. Perfect for nature lovers.",
  },
  {
    id: 107,
    user: "Michael Brown",
    time: "1 month ago",
    location: "Yala National Park",
    activity: "Stargazing",
    companions: 4,
    dateRange: "Apr 10 - Apr 12",
    description:
      "Wildlife safari and stargazing adventure in Yala National Park. Early morning game drives, bird watching, and photography opportunities. Wildlife enthusiasts preferred.",
  },
  {
    id: 108,
    user: "Emma Wilson",
    time: "1 month ago",
    location: "Adam's Peak",
    activity: "Stargazing",
    companions: 8,
    dateRange: "May 15 - May 17",
    description:
      "Sacred pilgrimage hike to Adam's Peak during the season. Spiritual journey with breathtaking sunrise views and stargazing. All fitness levels welcome, but prepare for stairs!",
  },
  {
    id: 109,
    user: "David Lee",
    time: "2 months ago",
    location: "Bentota",
    activity: "Camping",
    companions: 5,
    dateRange: "Jun 20 - Jun 22",
    description:
      "Water sports weekend camping in Bentota! Jet skiing, banana boat rides, and beach volleyball. Perfect for adventure seekers and beach lovers.",
  },
  {
    id: 110,
    user: "Lisa Garcia",
    time: "2 months ago",
    location: "Kandy",
    activity: "Stargazing",
    companions: 3,
    dateRange: "Jul 25 - Jul 27",
    description:
      "Cultural city tour of Kandy including Temple of the Tooth, botanical gardens, and stargazing sessions. Great for cultural enthusiasts.",
  },
];

export default function TravelBuddy() {
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const navigate = useNavigate();

  const handleCreatePost = async (formData) => {
    // Here you would typically send the data to your backend
    console.log("Creating post with data:", formData);
    
    // For now, just show a success message
    alert("Post created successfully!");
    
    // You can add the new post to your posts list here
    // For demo purposes, we'll just close the form
  };

  const handleChatToggle = () => {
    navigate('/travel-buddy/chat');
  };

  const handleRefreshPosts = () => {
    // In real implementation, this would fetch latest posts from API
    console.log("Refreshing posts...");
    
    // For demo purposes, we'll simulate a refresh by shuffling the posts
    const shuffledPosts = [...mockPosts].sort(() => Math.random() - 0.5);
    setPosts(shuffledPosts);
    
    // Show a brief loading state or success message
    console.log("Posts refreshed!");
  };


  return (
    <>
      <TravelBuddyNavbar onChatToggle={handleChatToggle} onRefresh={handleRefreshPosts} />
      <main className="bg-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: People List */}
            <aside className="lg:col-span-3 bg-white h-screen lg:h-screen flex flex-col sticky top-0 lg:sticky top-0 pl-4">
              <div className="p-4 border-b">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-md border-gray-300 focus:border-cyan-600 focus:ring-cyan-600 pr-9 h-10"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide hover:scrollbar-default">
                {mockUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full" />
                      <span className="text-gray-900 font-medium truncate">{u.name}</span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600" aria-label="Add">
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </aside>

            {/* Right: Feed */}
            <section className="lg:col-span-9 bg-white">
              {/* Composer */}
              <div className="p-4">
                <div className="max-w-2xl mx-auto border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-3">
                    <img src="/src/assets/auth/profile-pic.svg" alt="me" className="w-9 h-9 rounded-full" />
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Share your travel plan today"
                        className="w-full rounded-md border-gray-300 focus:border-cyan-600 focus:ring-cyan-600 h-10 pr-10 cursor-pointer"
                        onClick={() => setShowCreatePostForm(true)}
                        readOnly
                      />
                      <button 
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600" 
                        aria-label="Add image"
                        onClick={() => setShowCreatePostForm(true)}
                      >
                        <CameraIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts list */}
              <div className="p-4 space-y-6">
                {posts.map((p) => {
                  // Determine activity icon based on activity type
                  const getActivityIcon = (activity) => {
                    if (activity.toLowerCase().includes('camping')) {
                      return <TentIcon className="w-5 h-5 text-cyan-600" />;
                    }
                    if (activity.toLowerCase().includes('stargazing')) {
                      return <SparklesIcon className="w-5 h-5 text-cyan-600" />;
                    }
                    return <TentIcon className="w-5 h-5 text-cyan-600" />;
                  };

                  return (
                    <article key={p.id} className="border rounded-lg shadow-sm p-5 max-w-2xl mx-auto">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img src="/src/assets/auth/profile-pic.svg" alt={p.user} className="w-10 h-10 rounded-full" />
                          <h3 className="text-lg font-semibold text-gray-900">{p.user}</h3>
                        </div>
                        <span className="text-sm text-gray-500">{p.time}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 pl-4">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5 text-cyan-600" />
                          <span className="text-cyan-600 font-medium">{p.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-5 h-5 text-cyan-600" />
                          <span className="text-cyan-600 font-medium">{p.companions} companions needed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getActivityIcon(p.activity)}
                          <span className="text-cyan-600 font-medium">{p.activity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-5 h-5 text-cyan-600" />
                          <span className="text-cyan-600 font-medium">{p.dateRange}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mt-4 leading-relaxed">{p.description}</p>

                      <div className="mt-4 bg-gray-200 rounded-md h-56 sm:h-72 w-full" />

                      <div className="mt-4 flex justify-end">
                        <Button size="md">Connect</Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
      
      {/* Divider */}
      <hr className="mt-20 mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      
      <Footer />
      
      {/* Create Post Form Modal */}
      {showCreatePostForm && (
        <CreatePostForm
          onClose={() => setShowCreatePostForm(false)}
          onSubmit={handleCreatePost}
        />
      )}

    </>
  );
}
