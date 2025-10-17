import { Building2, Folder } from "lucide-react";
import type { Organization } from "../../types";

interface OrganizationCardProps {
  organization: Organization;
  onClick: () => void;
}

export default function OrganizationCard({
  organization,
  onClick,
}: OrganizationCardProps) {
  return (
    <div
      onClick={onClick}
      className="card hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          {organization.avatarUrl ? (
            <img
              src={organization.avatarUrl}
              alt={organization.login}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {organization.login}
            </h3>
            {organization.publicRepos !== undefined && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Folder className="w-4 h-4" />
                <span>{organization.publicRepos} repositories</span>
              </div>
            )}
          </div>
        </div>

        {organization.description && (
          <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
            {organization.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
            상세 통계 보기 →
          </span>
        </div>
      </div>
    </div>
  );
}
