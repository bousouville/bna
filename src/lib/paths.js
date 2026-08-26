import { base } from '$app/paths';

/** 内部链接统一挂载 base：GH Pages 项目子路径（/bna）与根路径部署双兼容 */
export function withBase(path) {
	if (!path) return path;
	if (/^(https?:)?\/\//i.test(path) || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('data:')) {
		return path;
	}
	const stripped = base && path.startsWith(base) ? path.slice(base.length) : path;
	return stripped === '/' ? base || '/' : base + stripped;
}
