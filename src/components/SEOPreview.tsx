import { Globe } from 'lucide-react';

interface SEOPreviewProps {
  title: string;
  description: string;
  url: string;
  titleLength?: number;
  descriptionLength?: number;
}

export default function SEOPreview({
  title,
  description,
  url,
  titleLength = 60,
  descriptionLength = 160
}: SEOPreviewProps) {
  const truncateTitle = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const displayTitle = truncateTitle(title || 'Your Blog Post Title', titleLength);
  const displayDescription = truncateDescription(
    description || 'Your post description will appear here...',
    descriptionLength
  );
  const displayUrl = url || 'yourdomain.com/blog/your-post-slug';

  const getTitleColor = () => {
    if (!title) return 'text-neutral-400';
    if (title.length > titleLength) return 'text-orange-600';
    if (title.length < 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDescriptionColor = () => {
    if (!description) return 'text-neutral-400';
    if (description.length > descriptionLength) return 'text-orange-600';
    if (description.length < 120) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="border border-neutral-300 rounded-lg p-6 bg-neutral-50">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-neutral-600" />
        <h3 className="text-sm font-medium text-neutral-700">
          Google Search Preview
        </h3>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="mb-1">
          <div className="text-sm text-blue-600 mb-1">{displayUrl}</div>
          <div className="text-xl text-blue-800 hover:underline cursor-pointer mb-1">
            {displayTitle}
          </div>
          <div className="text-sm text-neutral-600 leading-relaxed">
            {displayDescription}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-600">Title Length:</span>
            <span className={getTitleColor()}>
              {title?.length || 0} / {titleLength}
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                !title
                  ? 'bg-neutral-400'
                  : title.length > titleLength
                  ? 'bg-orange-500'
                  : title.length < 30
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((title?.length || 0) / titleLength * 100, 100)}%` }}
            />
          </div>
          <div className="text-neutral-500 mt-1">
            {!title
              ? 'Add a title'
              : title.length > titleLength
              ? 'Too long - will be truncated'
              : title.length < 30
              ? 'Too short - add more detail'
              : 'Good length'}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-600">Description Length:</span>
            <span className={getDescriptionColor()}>
              {description?.length || 0} / {descriptionLength}
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                !description
                  ? 'bg-neutral-400'
                  : description.length > descriptionLength
                  ? 'bg-orange-500'
                  : description.length < 120
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((description?.length || 0) / descriptionLength * 100, 100)}%` }}
            />
          </div>
          <div className="text-neutral-500 mt-1">
            {!description
              ? 'Add a description'
              : description.length > descriptionLength
              ? 'Too long - will be truncated'
              : description.length < 120
              ? 'Too short - add more detail'
              : 'Good length'}
          </div>
        </div>
      </div>
    </div>
  );
}
