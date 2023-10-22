on_auth_user_created ----- handle_new_user

on_insert_initiative ------- fn_create_group

avatar_upload_trigger ----- fn_set_avatar

before_interested_insert ------ fn_check_delete_log
on_interested_delete_1 ----- fn_subtract_interested_count_on_initiatives_table
on_interested_delete ----- fn_insert_into_delete_log
on_interested_click ----- handle_interested_click
