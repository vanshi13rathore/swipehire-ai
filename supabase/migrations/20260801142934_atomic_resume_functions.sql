-- Create a function to atomically create a new resume and optionally set it as default
CREATE OR REPLACE FUNCTION create_resume_atomic(
    p_title TEXT,
    p_resume_data JSONB,
    p_is_default BOOLEAN
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_new_resume JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF p_is_default THEN
        -- Unset other defaults for this user
        UPDATE resume_versions
        SET is_default = false
        WHERE user_id = v_user_id AND is_default = true;
    END IF;

    -- Insert new resume and return it as JSONB
    INSERT INTO resume_versions (user_id, title, resume_data, is_default)
    VALUES (v_user_id, p_title, p_resume_data, p_is_default)
    RETURNING to_jsonb(resume_versions.*) INTO v_new_resume;

    RETURN v_new_resume;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to atomically set an existing resume as default
CREATE OR REPLACE FUNCTION set_default_resume_atomic(
    p_resume_id UUID
) RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Verify the resume belongs to the user
    IF NOT EXISTS (SELECT 1 FROM resume_versions WHERE id = p_resume_id AND user_id = v_user_id) THEN
        RAISE EXCEPTION 'Resume not found or access denied';
    END IF;

    -- First unset all defaults for the user
    UPDATE resume_versions
    SET is_default = false
    WHERE user_id = v_user_id AND is_default = true;

    -- Then set the new one to true
    UPDATE resume_versions
    SET is_default = true
    WHERE id = p_resume_id AND user_id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
