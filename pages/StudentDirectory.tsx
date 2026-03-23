import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, GraduationCap, X, User, ArrowUpRight } from 'lucide-react';
import { getAllStudents, UserProfile } from '../services/userService';

const StudentDirectory: React.FC = () => {
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCollege, setFilterCollege] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterYear, setFilterYear] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getAllStudents();
                setStudents(data);
            } catch (error) {
                console.error("Failed to load students:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Unique values for dropdowns
    const colleges = useMemo(() => Array.from(new Set(students.map(s => s.college).filter(Boolean))), [students]);
    const courses = useMemo(() => Array.from(new Set(students.map(s => s.course).filter(Boolean))), [students]);
    const years = useMemo(() => Array.from(new Set(students.map(s => s.year).filter(Boolean))), [students]);

    // Derived filtered collection
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesName = student.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCollege = filterCollege ? student.college === filterCollege : true;
            const matchesCourse = filterCourse ? student.course === filterCourse : true;
            const matchesYear = filterYear ? student.year === filterYear : true;
            
            return matchesName && matchesCollege && matchesCourse && matchesYear;
        });
    }, [students, searchTerm, filterCollege, filterCourse, filterYear]);

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-16 selection:bg-[#B9FF66] selection:text-[#191A23]">
            {/* Elegant Landing-Style Header section */}
            <div className="flex flex-col items-center justify-center text-center mb-12 max-w-3xl mx-auto pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-[#191A23] dark:text-white leading-tight mb-6">
                    Discover the <span className="bg-[#B9FF66] text-[#191A23] px-3 py-1 rounded-xl shadow-sm border border-[#191A23]">Top Talent</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-300">
                    Search our live public grid to find verified students and connect with the perfect fits for your next big opportunity.
                </p>
            </div>

            {/* Robust Search and Filtering Bar - Landing Style */}
            <div className="bg-[#F3F3F3] dark:bg-[#1E293B] border border-[#191A23] dark:border-gray-700 rounded-[30px] p-6 shadow-[0_4px_0_0_#191A23] dark:shadow-[0_4px_0_0_#0F172A] relative z-30">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Real-time Search */}
                    <div className="md:col-span-5 relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search size={22} className="text-[#191A23] dark:text-white" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-12 py-4 bg-white dark:bg-[#0B0F19] border border-[#191A23] dark:border-gray-600 rounded-xl text-[#191A23] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#B9FF66] transition-shadow shadow-[0_2px_0_0_#191A23] dark:shadow-none placeholder-gray-500"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#191A23] dark:text-gray-300 hover:text-red-500"
                            >
                                <X size={20} borderWidth={3} />
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="relative">
                            <select
                                value={filterCollege}
                                onChange={(e) => setFilterCollege(e.target.value)}
                                className="w-full px-5 py-4 bg-white dark:bg-[#0B0F19] border border-[#191A23] dark:border-gray-600 rounded-xl text-[#191A23] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#B9FF66] transition-shadow appearance-none cursor-pointer shadow-[0_2px_0_0_#191A23] dark:shadow-none"
                            >
                                <option value="">University: All</option>
                                {colleges.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Filter size={16} className="text-[#191A23] dark:text-gray-400" />
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                                className="w-full px-5 py-4 bg-white dark:bg-[#0B0F19] border border-[#191A23] dark:border-gray-600 rounded-xl text-[#191A23] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#B9FF66] transition-shadow appearance-none cursor-pointer shadow-[0_2px_0_0_#191A23] dark:shadow-none"
                            >
                                <option value="">Course: All</option>
                                {courses.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Filter size={16} className="text-[#191A23] dark:text-gray-400" />
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="w-full px-5 py-4 bg-white dark:bg-[#0B0F19] border border-[#191A23] dark:border-gray-600 rounded-xl text-[#191A23] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#B9FF66] transition-shadow appearance-none cursor-pointer shadow-[0_2px_0_0_#191A23] dark:shadow-none"
                            >
                                <option value="">Class of: All</option>
                                {years.map(y => <option key={y as string} value={y as string}>{y as string}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Filter size={16} className="text-[#191A23] dark:text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Active Filters Clear Button */}
                {(filterCollege || filterCourse || filterYear) && (
                    <div className="mt-5 flex flex-wrap gap-3 items-center border-t border-gray-300 dark:border-gray-700 pt-5">
                        <span className="text-sm font-bold text-[#191A23] dark:text-gray-300">Active Filters:</span>
                        {filterCollege && <span className="text-sm bg-[#191A23] dark:bg-white text-white dark:text-[#0B0F19] px-4 py-1.5 rounded-full font-semibold">{filterCollege}</span>}
                        {filterCourse && <span className="text-sm bg-[#B9FF66] text-[#191A23] px-4 py-1.5 rounded-full font-semibold border border-[#191A23]">{filterCourse}</span>}
                        {filterYear && <span className="text-sm bg-white dark:bg-slate-700 text-[#191A23] dark:text-white px-4 py-1.5 rounded-full font-semibold border border-[#191A23] dark:border-gray-500">Class of {filterYear}</span>}
                        <button 
                            onClick={() => { setFilterCollege(''); setFilterCourse(''); setFilterYear(''); }}
                            className="text-sm font-bold text-red-600 hover:text-red-800 underline ml-2"
                        >
                            Reset
                        </button>
                    </div>
                )}
            </div>

            {/* Results Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <div className="w-16 h-16 border-4 border-[#191A23] dark:border-white border-t-[#B9FF66] rounded-full animate-spin"></div>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="bg-[#F3F3F3] dark:bg-[#1E293B] p-16 rounded-[40px] border border-[#191A23] dark:border-gray-700 text-center shadow-[0_4px_0_0_#191A23] dark:shadow-[0_4px_0_0_#0F172A]">
                    <div className="w-24 h-24 bg-[#B9FF66] border-4 border-[#191A23] rounded-full flex items-center justify-center mx-auto mb-6 text-[#191A23] shadow-inner">
                        <Search size={40} />
                    </div>
                    <h3 className="text-3xl font-bold text-[#191A23] dark:text-white mb-3">No profiles found</h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">Try broadening your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStudents.map(student => (
                        <Link 
                            key={student.id} 
                            to={`/portfolio/${student.id}`}
                            className="bg-white dark:bg-[#0B0F19] rounded-[40px] p-8 border border-[#191A23] dark:border-gray-700 hover:bg-[#B9FF66] hover:border-[#191A23] hover:shadow-[0_6px_0_0_#191A23] dark:hover:shadow-[0_6px_0_0_#0F172A] transition-all duration-300 flex flex-col group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-20 h-20 bg-[#F3F3F3] dark:bg-slate-800 border-2 border-[#191A23] dark:border-gray-600 rounded-full flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#191A23]">
                                    {student.avatar ? (
                                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-[#191A23] dark:text-gray-400" />
                                    )}
                                </div>
                                <div className="bg-[#191A23] text-[#B9FF66] text-sm font-bold px-3 py-1.5 rounded-lg border border-[#191A23]">
                                    {student.totalCredits || 0} pts
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-[#191A23] dark:text-white group-hover:text-[#191A23] transition-colors line-clamp-1">{student.name}</h3>
                                {student.college && <p className="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#191A23] mt-2 flex items-center gap-2"><GraduationCap size={16}/> {student.college}</p>}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 group-hover:border-[#191A23]/20 flex flex-wrap gap-3 items-center justify-between">
                                <div className="flex flex-wrap gap-2 text-sm">
                                    {student.course && <span className="bg-[#F3F3F3] dark:bg-slate-800 text-[#191A23] dark:text-white group-hover:bg-white font-semibold px-3 py-1.5 rounded-lg border border-[#191A23] dark:border-gray-600">{student.course}</span>}
                                    {student.year && <span className="bg-[#191A23] dark:bg-white text-[#B9FF66] dark:text-[#191A23] font-bold px-3 py-1.5 rounded-lg border border-[#191A23]">'{student.year}</span>}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#191A23] flex items-center justify-center text-[#B9FF66] group-hover:bg-white group-hover:text-[#191A23] transition-colors border border-transparent group-hover:border-[#191A23]">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentDirectory;
