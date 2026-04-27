-- =============================================================================
-- Migration: 025_reassign_blogs_to_eden.sql
-- Description: Reassigns all blog posts from the legacy WWT agent
--              (14385e4b-7dbe-4642-88b8-1a1a0279f5d2) to Eden For Your World
--              (2e18df43-171a-4565-b840-aade259cab69).
--              All existing posts are Eden's WordPress imports.
-- =============================================================================

UPDATE public.blog_posts
SET agent_id = '2e18df43-171a-4565-b840-aade259cab69'
WHERE agent_id = '14385e4b-7dbe-4642-88b8-1a1a0279f5d2';
