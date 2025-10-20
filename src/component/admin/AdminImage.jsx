
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';
import { adminDeleteImages, getAllImages } from '../../lib/api';

export function AdminImage() {
    const [user] = useAuthState(auth);
    const [allImages, setAllImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState(new Set());
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        loadAllImages();
    }, [user]);
    console.log("This is user Details :", user);
    
    const loadAllImages = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await getAllImages(user);
            setAllImages(data.images || []);
        } catch (error) {
            console.error('Error loading images:', error);
            alert('Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectImage = (publicId) => {
        setSelectedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(publicId)) {
                newSet.delete(publicId);
            } else {
                newSet.add(publicId);
            }
            return newSet;
        });
    };

    const handleDeleteSelected = async () => {
        if (selectedImages.size === 0) return;

        if (!confirm(`Delete ${selectedImages.size} images? This cannot be undone.`)) return;

        setLoading(true);
        try {
            await adminDeleteImages(Array.from(selectedImages), user);
            await loadAllImages(); // Refresh the list
            setSelectedImages(new Set());
            alert('Images deleted successfully!');
        } catch (error) {
            console.error('Error deleting images:', error);
            alert('Failed to delete images');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('Delete ALL images? This cannot be undone!')) return;

        setLoading(true);
        try {
            const allPublicIds = allImages.map(img => img.publicId);
            await adminDeleteImages(allPublicIds, user);
            setAllImages([]);
            setSelectedImages(new Set());
            alert('All images deleted successfully!');
        } catch (error) {
            console.error('Error deleting all images:', error);
            alert('Failed to delete all images');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Admin Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
                            <p className="text-gray-600 mt-1">
                                Total Images: <span className="font-semibold text-blue-600">{allImages.length}</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selectedImages.size === 0}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Selected ({selectedImages.size})
                            </button>

                            <button
                                onClick={handleDeleteAll}
                                disabled={allImages.length === 0}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-800 hover:bg-red-900 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Delete All Images
                            </button>
                        </div>
                    </div>
                </div>

                {/* Images Grid */}
                {allImages.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                        <p className="text-gray-500">Images generated by users will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allImages.map((image) => (
                            <div
                                key={image.publicId}
                                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${selectedImages.has(image.publicId)
                                        ? 'border-blue-500 ring-4 ring-blue-100'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => handleSelectImage(image.publicId)}
                            >
                                {/* Selection Indicator */}
                                {selectedImages.has(image.publicId) && (
                                    <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}

                                {/* Image */}
                                <div className="aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                                    <img
                                        src={image.url}
                                        alt={image.prompt}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>

                                {/* Image Info */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-start space-x-2">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-gray-500">User</p>
                                            <p className="text-sm text-gray-900 truncate">{image.userEmail}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-gray-500">Prompt</p>
                                            <p className="text-sm text-gray-900 line-clamp-2">{image.prompt}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Created</p>
                                            <p className="text-sm text-gray-900">
                                                {new Date(image.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}