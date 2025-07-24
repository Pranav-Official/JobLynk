import { useForm } from 'react-hook-form';
import type { JobStatusType, JobTypeType } from '@/constants/enums';
import { JobStatus, JobType } from '@/constants/enums';

type CreateJobFormData = {
  title: string;
  descriptionMarkdown: string;
  location: string;
  jobType: JobTypeType;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  applyUrl: string;
  status: JobStatusType;
  expiresAt: string;
  easyApply: boolean;
  skills: string;
};

type CreateJobFormProps = {
  onClose: () => void;
  onSubmit: (data: Omit<CreateJobFormData, 'skills'> & { skills: string[] }) => void;
  isLoading?: boolean;
};

export function CreateJobForm({
  onClose,
  onSubmit,
  isLoading,
}: CreateJobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateJobFormData>();

  const transformAndSubmit = (data: CreateJobFormData) => {
    const transformedData = {
      ...data,
      skills: data.skills
        ? data.skills.split(',').map((skill) => skill.trim())
        : [],
    };
    onSubmit(transformedData);
  };

  return (
    <form
      onSubmit={handleSubmit(transformAndSubmit)}
      className="space-y-6 p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-2xl"
    >
      <h2 className="text-2xl font-bold text-gray-900 text-center">
        Create New Job Post
      </h2>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Job Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Job Title is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="descriptionMarkdown"
          className="block text-sm font-medium text-gray-700"
        >
          Job Description (Markdown)
        </label>
        <textarea
          id="descriptionMarkdown"
          {...register('descriptionMarkdown', {
            required: 'Job Description is required',
          })}
          rows={6}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        {errors.descriptionMarkdown && (
          <p className="mt-1 text-sm text-red-600">
            {errors.descriptionMarkdown.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          id="location"
          type="text"
          {...register('location', { required: 'Location is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="skills"
          className="block text-sm font-medium text-gray-700"
        >
          Skills (comma-separated)
        </label>
        <input
          id="skills"
          type="text"
          {...register('skills')}
          placeholder="e.g., React, Node.js, TypeScript"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.skills && (
          <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="jobType"
          className="block text-sm font-medium text-gray-700"
        >
          Job Type
        </label>
        <select
          id="jobType"
          {...register('jobType', { required: 'Job Type is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Job Type</option>
          {Object.values(JobType).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
        {errors.jobType && (
          <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="salaryMin"
            className="block text-sm font-medium text-gray-700"
          >
            Minimum Salary
          </label>
          <input
            id="salaryMin"
            type="number"
            {...register('salaryMin', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="salaryMax"
            className="block text-sm font-medium text-gray-700"
          >
            Maximum Salary
          </label>
          <input
            id="salaryMax"
            type="number"
            {...register('salaryMax', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="salaryCurrency"
            className="block text-sm font-medium text-gray-700"
          >
            Currency
          </label>
          <input
            id="salaryCurrency"
            type="text"
            {...register('salaryCurrency')}
            placeholder="e.g., USD, EUR"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="applyUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Application URL
        </label>
        <input
          id="applyUrl"
          type="url"
          {...register('applyUrl', {
            required: 'Application URL is required',
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: 'Invalid URL format',
            },
          })}
          placeholder="https://example.com/apply"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.applyUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.applyUrl.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          {...register('status', { required: 'Status is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Status</option>
          {Object.values(JobStatus).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="expiresAt"
          className="block text-sm font-medium text-gray-700"
        >
          Expires At (Optional)
        </label>
        <input
          id="expiresAt"
          type="date"
          {...register('expiresAt')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          id="easyApply"
          type="checkbox"
          {...register('easyApply')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="easyApply" className="ml-2 block text-sm text-gray-900">
          Enable Easy Apply
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Job'}
        </button>
      </div>
    </form>
  );
}